import { useState } from 'react';
import { Search, Loader2, Sparkles, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { places } from '@/data/places';
import { artisans } from '@/data/artisans';
import { toast } from 'sonner';

interface Props {
  onResults: (placeIds: string[], artisanIds: string[], explanation: string) => void;
  onClear: () => void;
}

const AISearch = ({ onResults, onClear }: Props) => {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  const search = async () => {
    if (!q.trim() || loading) return;
    setLoading(true);
    try {
      const url = '/api/ai-assistant';
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'search', query: q,
          places: places.map(p => `${p.id}|${p.name}|${p.category}|${p.description}`).join('\n'),
          artisans: artisans.map(a => `${a.id}|${a.name}|${a.craft}|${a.specialty}|${a.location}`).join('\n'),
        }),
      });
      if (resp.status === 429) { toast.error('Too many requests'); return; }
      if (resp.status === 402) { toast.error('AI credits exhausted'); return; }
      const data = await resp.json();
      onResults(data.place_ids ?? [], data.artisan_ids ?? [], data.explanation ?? '');
      setActive(true);
    } catch { toast.error('Search failed'); }
    finally { setLoading(false); }
  };

  const clear = () => { setQ(''); setActive(false); onClear(); };

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-secondary" />
        <h3 className="font-serif font-semibold text-foreground">AI Smart Search</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">Try: "quiet sandalwood workshops near Chamundi" or "hidden food spots avoiding crowds"</p>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()} placeholder="Describe what you're looking for..." className="pl-9" />
          {active && <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
        </div>
        <Button onClick={search} disabled={loading || !q.trim()}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

export default AISearch;
