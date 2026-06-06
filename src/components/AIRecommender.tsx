import { useEffect, useRef, useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { places } from '@/data/places';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

const CACHE_KEY = 'ai-recommender-cache';
const CACHE_TTL = 15 * 60 * 1000; // 15 min

const AIRecommender = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const inflight = useRef(false);

  const fetchRec = async (force = false) => {
    if (inflight.current) return;
    if (!force) {
      try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (raw) {
          const { t, v } = JSON.parse(raw);
          if (Date.now() - t < CACHE_TTL && v) { setText(v); return; }
        }
      } catch {}
    }
    inflight.current = true;
    setLoading(true);
    try {
      const high = places.filter(p => p.crowdLevel === 'high');
      const altIds = new Set(high.flatMap(p => p.nearbyAlternatives ?? []));
      const alts = places.filter(p => altIds.has(p.id) || p.crowdLevel === 'low');
      const resp = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'recommend',
          hour: new Date().getHours(),
          highCrowdNames: high.map(p => p.name),
          alternatives: alts.map(p => `- ${p.name} (${p.category}): ${p.description}`).join('\n'),
        }),
      });
      if (resp.status === 429) {
        toast.error('AI quota reached for today. Try again later.');
        setText('Daily AI quota reached. Recommendations will resume tomorrow.');
        return;
      }
      const data = await resp.json();
      const result = data.result ?? '';
      setText(result);
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), v: result })); } catch {}
    } catch { setText('Unable to fetch recommendation right now.'); }
    finally { setLoading(false); inflight.current = false; }
  };

  useEffect(() => { fetchRec(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondary" />
          <h3 className="font-serif font-semibold text-foreground">AI Pick for Right Now</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={() => fetchRec(true)} disabled={loading} aria-label="refresh">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        </Button>
      </div>
      <div className="text-sm text-foreground prose prose-sm max-w-none">
        {loading && !text ? <p className="text-muted-foreground">Analyzing crowd levels...</p> : <ReactMarkdown>{text}</ReactMarkdown>}
      </div>
    </div>
  );
};

export default AIRecommender;
