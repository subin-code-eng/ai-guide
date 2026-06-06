import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { places } from '@/data/places';
import { artisans } from '@/data/artisans';
import { trails } from '@/data/trails';
import { toast } from 'sonner';

type Msg = { role: 'user' | 'assistant'; content: string };

const buildContext = () => {
  const p = places.map(x => `- [${x.id}] ${x.name} (${x.category}, crowd:${x.crowdLevel}): ${x.description}`).join('\n');
  const a = artisans.map(x => `- [${x.id}] ${x.name} — ${x.craft}, ${x.specialty}, ${x.location}`).join('\n');
  const t = trails.map(x => `- ${x.name}: ${x.tagline} (${x.duration})`).join('\n');
  return `PLACES:\n${p}\n\nARTISANS:\n${a}\n\nTRAILS:\n${t}`;
};

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Namaste! 🙏 I am your Mysuru Heritage Guide. Ask me about hidden gems, master artisans, or quiet alternatives to crowded spots.' },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const url = '/api/ai-assistant';
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'chat', messages: next, context: buildContext() }),
      });
      if (resp.status === 429) { toast.error('Too many requests, please wait.'); setLoading(false); return; }
      if (resp.status === 402) { toast.error('AI credits exhausted.'); setLoading(false); return; }
      if (!resp.ok || !resp.body) throw new Error('Stream failed');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let acc = '';
      setMessages(m => [...m, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, nl); buffer = buffer.slice(nl + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const c = JSON.parse(json).choices?.[0]?.delta?.content;
            if (c) { acc += c; setMessages(m => m.map((mm, i) => i === m.length - 1 ? { ...mm, content: acc } : mm)); }
          } catch { buffer = line + '\n' + buffer; break; }
        }
      }
    } catch (e) {
      toast.error('AI guide is unavailable.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full heritage-gradient shadow-lg flex items-center justify-center text-primary-foreground"
        aria-label="Open AI Heritage Guide"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[60] w-[360px] max-w-[92vw] h-[520px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="heritage-gradient text-primary-foreground px-4 py-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <div>
                <p className="font-serif font-bold leading-tight">Mysuru Heritage Guide</p>
                <p className="text-xs opacity-90">AI-powered • Real-time</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/30">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-card border border-border rounded-bl-sm'}`}>
                    {m.content || <Loader2 className="w-4 h-4 animate-spin" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-border bg-card flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                placeholder="Ask about hidden gems, artisans..."
                disabled={loading}
              />
              <Button size="icon" onClick={send} disabled={loading || !input.trim()}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
