import { useState } from 'react';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { places } from '@/data/places';
import { artisans } from '@/data/artisans';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface GeneratedTrail {
  name: string;
  tagline: string;
  narrative: string;
  place_ids: string[];
  artisan_ids: string[];
  estimated_duration: string;
}

const AITrailGenerator = () => {
  const [interests, setInterests] = useState('');
  const [hours, setHours] = useState('3');
  const [loading, setLoading] = useState(false);
  const [trail, setTrail] = useState<GeneratedTrail | null>(null);

  const generate = async () => {
    if (!interests.trim()) return;
    setLoading(true);
    try {
      const url = '/api/ai-assistant';
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'generate_trail', interests, hours,
          places: places.map(p => `${p.id}|${p.name}|${p.category}|${p.description}`).join('\n'),
          artisans: artisans.map(a => `${a.id}|${a.name}|${a.craft}|${a.specialty}`).join('\n'),
        }),
      });
      if (resp.status === 429) { toast.error('Too many requests'); return; }
      if (resp.status === 402) { toast.error('AI credits exhausted'); return; }
      const data = await resp.json();
      if (data) setTrail(data);
    } catch { toast.error('Generation failed'); }
    finally { setLoading(false); }
  };

  const tellStory = async () => {
    if (!trail) return;
    setLoading(true);
    try {
      const items = [
        ...trail.place_ids.map(id => { const p = places.find(x => x.id === id); return p && { name: p.name, type: 'place', description: p.description }; }).filter(Boolean),
        ...trail.artisan_ids.map(id => { const a = artisans.find(x => x.id === id); return a && { name: a.name, type: 'artisan', description: a.specialty }; }).filter(Boolean),
      ];
      const url = '/api/ai-assistant';
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'storyteller', items }),
      });
      const data = await resp.json();
      if (data.result) setTrail({ ...trail, narrative: data.result });
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Wand2 className="w-5 h-5 text-secondary" />
        <h3 className="font-serif text-xl font-bold text-foreground">AI Custom Trail Builder</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Tell us your interests — AI weaves a personal cultural route through Mysuru.</p>

      <div className="grid sm:grid-cols-[1fr_120px_auto] gap-3 mb-4">
        <div>
          <Label className="text-xs">Your interests</Label>
          <Input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="silk, food, quiet temples" />
        </div>
        <div>
          <Label className="text-xs">Hours</Label>
          <Input type="number" min={1} max={12} value={hours} onChange={(e) => setHours(e.target.value)} />
        </div>
        <div className="self-end">
          <Button onClick={generate} disabled={loading || !interests.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4 mr-1.5" /> Generate</>}
          </Button>
        </div>
      </div>

      {trail && (
        <div className="border-t border-border pt-4 space-y-3">
          <div>
            <h4 className="font-serif text-lg font-bold text-foreground">{trail.name}</h4>
            <p className="text-sm text-secondary italic">{trail.tagline}</p>
            <p className="text-xs text-muted-foreground mt-1">⏱ {trail.estimated_duration}</p>
          </div>
          <div className="text-sm text-foreground prose prose-sm max-w-none">
            <ReactMarkdown>{trail.narrative}</ReactMarkdown>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">Stops:</p>
            <ul className="text-sm space-y-1">
              {trail.place_ids.map(id => { const p = places.find(x => x.id === id); return p && <li key={id}>📍 <span className="font-medium">{p.name}</span> <span className="text-muted-foreground">— {p.category}</span></li>; })}
              {trail.artisan_ids.map(id => { const a = artisans.find(x => x.id === id); return a && <li key={id}>🎨 <span className="font-medium">{a.name}</span> <span className="text-muted-foreground">— {a.craft}</span></li>; })}
            </ul>
          </div>
          <Button variant="outline" size="sm" onClick={tellStory} disabled={loading}>
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Re-narrate as story
          </Button>
        </div>
      )}
    </div>
  );
};

export default AITrailGenerator;
