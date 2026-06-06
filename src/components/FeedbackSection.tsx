import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Send, Loader2 } from 'lucide-react';
import { supabase as supabaseTyped } from '@/integrations/supabase/client';
const supabase = supabaseTyped as any;
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { z } from 'zod';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'places', label: 'Hidden Gems' },
  { value: 'artisans', label: 'Artisans' },
  { value: 'trails', label: 'Cultural Trails' },
  { value: 'ai', label: 'AI Features' },
  { value: 'bug', label: 'Report a Bug' },
  { value: 'suggestion', label: 'Suggestion' },
];

const feedbackSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  email: z.string().trim().email('Invalid email').max(160).optional().or(z.literal('')),
  rating: z.number().int().min(1, 'Please select a rating').max(5),
  category: z.string().min(1),
  message: z.string().trim().min(10, 'Min 10 characters').max(1000),
});

type FeedbackRow = {
  id: string;
  name: string;
  rating: number;
  category: string;
  message: string;
  created_at: string;
};

const StarRow = ({
  value,
  onChange,
  size = 'md',
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: 'sm' | 'md';
}) => {
  const [hover, setHover] = useState(0);
  const px = size === 'sm' ? 'w-4 h-4' : 'w-7 h-7';
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = (hover || value) >= n;
        const Btn = onChange ? 'button' : 'span';
        return (
          <Btn
            key={n}
            type={onChange ? 'button' : undefined}
            onClick={onChange ? () => onChange(n) : undefined}
            onMouseEnter={onChange ? () => setHover(n) : undefined}
            onMouseLeave={onChange ? () => setHover(0) : undefined}
            className={onChange ? 'cursor-pointer transition-transform hover:scale-110' : ''}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <Star
              className={`${px} ${active ? 'fill-secondary text-secondary' : 'text-muted-foreground/40'}`}
            />
          </Btn>
        );
      })}
    </div>
  );
};

const FeedbackSection = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState<FeedbackRow[]>([]);
  const [stats, setStats] = useState({ avg: 0, count: 0 });

  const load = async () => {
    const { data } = await supabase
      .from('feedback')
      .select('id, name, rating, category, message, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(6);
    if (data) {
      setItems(data as FeedbackRow[]);
    }
    const { data: allRatings } = await supabase
      .from('feedback')
      .select('rating')
      .eq('published', true);
    if (allRatings && allRatings.length) {
      const sum = allRatings.reduce((s: number, r: any) => s + r.rating, 0);
      setStats({ avg: sum / allRatings.length, count: allRatings.length });
    }
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel('feedback_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback' }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (user && !name) {
      setName((user.user_metadata?.display_name as string) || user.email?.split('@')[0] || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = feedbackSchema.safeParse({ name, email, rating, category, message });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!user) {
      toast.error('Please sign in to submit feedback');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('feedback').insert({
      user_id: user.id,
      name: parsed.data.name,
      email: parsed.data.email || null,
      rating: parsed.data.rating,
      category: parsed.data.category,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Thanks for your feedback!');
    setMessage('');
    setRating(0);
    setCategory('general');
  };

  return (
    <section id="feedback" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
            Visitor Feedback
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Help us shape Mysuru Beyond. Rate your experience, share suggestions, or report issues.
          </p>
          {stats.count > 0 && (
            <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-muted">
              <StarRow value={Math.round(stats.avg)} size="sm" />
              <span className="text-sm font-semibold text-foreground">
                {stats.avg.toFixed(1)} / 5
              </span>
              <span className="text-xs text-muted-foreground">
                ({stats.count} review{stats.count > 1 ? 's' : ''})
              </span>
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Form */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="font-serif">Share Your Experience</CardTitle>
              <CardDescription>Your input directly improves the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <Label className="mb-2 block">Your Rating *</Label>
                  <StarRow value={rating} onChange={setRating} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="fb-name">Name *</Label>
                    <Input
                      id="fb-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={80}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fb-email">Email</Label>
                    <Input
                      id="fb-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={160}
                      placeholder="optional"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="fb-cat">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="fb-cat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fb-msg">Your Feedback *</Label>
                  <Textarea
                    id="fb-msg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    maxLength={1000}
                    placeholder="What did you love? What can we improve?"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {message.length}/1000
                  </p>
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send /> Submit Feedback
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Testimonials */}
          <div className="lg:col-span-3">
            <h3 className="font-serif text-xl font-semibold mb-4 text-foreground">
              What visitors are saying
            </h3>
            {items.length === 0 ? (
              <Card className="p-8 text-center">
                <Quote className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Be the first to share your experience.
                </p>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {items.map((f, i) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <StarRow value={f.rating} size="sm" />
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                            {f.category}
                          </span>
                        </div>
                        <Quote className="w-4 h-4 text-secondary mb-1" />
                        <p className="text-sm text-foreground/90 leading-relaxed line-clamp-4">
                          {f.message}
                        </p>
                        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground">{f.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(f.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
