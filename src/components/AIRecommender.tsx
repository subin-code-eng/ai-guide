import { useEffect, useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { places } from '@/data/places';
import ReactMarkdown from 'react-markdown';

const AIRecommender = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRec = async () => {
    setLoading(true);
    try {
      const high = places.filter(p => p.crowdLevel === 'high');
      const altIds = new Set(high.flatMap(p => p.nearbyAlternatives ?? []));
      const alts = places.filter(p => altIds.has(p.id) || p.crowdLevel === 'low');
      const url = '/api/ai-assistant';
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'recommend',
          hour: new Date().getHours(),
          highCrowdNames: high.map(p => p.name),
          alternatives: alts.map(p => `- ${p.name} (${p.category}): ${p.description}`).join('\n'),
        }),
      });
      const data = await resp.json();
      setText(data.result ?? '');
    } catch { setText('Unable to fetch recommendation right now.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRec(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondary" />
          <h3 className="font-serif font-semibold text-foreground">AI Pick for Right Now</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={fetchRec} disabled={loading} aria-label="refresh">
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
