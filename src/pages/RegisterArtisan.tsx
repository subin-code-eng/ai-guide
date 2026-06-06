import { useEffect, useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { z } from 'zod';
import { Loader2, Upload, ArrowLeft, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  craft: z.enum(['silk', 'wood', 'pottery', 'painting', 'sandalwood']),
  specialty: z.string().trim().min(3).max(200),
  story: z.string().trim().min(10).max(1000),
  experience: z.string().trim().min(1).max(50),
  location: z.string().trim().min(2).max(200),
  contact: z.string().trim().max(200).optional(),
  products: z.string().trim().max(300).optional(),
});

const RegisterArtisan = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [existingId, setExistingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '', craft: 'silk', specialty: '', story: '',
    experience: '', location: '', contact: '', products: '',
  });

  useEffect(() => {
    if (!user) return;
    supabase.from('artisan_profiles').select('*').eq('user_id', user.id).maybeSingle()
      .then(({ data }: { data: any }) => {
        if (data) {
          setExistingId(data.id);
          setForm({
            name: data.name, craft: data.craft, specialty: data.specialty,
            story: data.story, experience: data.experience, location: data.location,
            contact: data.contact ?? '', products: (data.products ?? []).join(', '),
          });
          if (data.photo_url) setPhotoPreview(data.photo_url);
        }
      });
  }, [user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Photo must be under 5MB'); return; }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const enhanceStory = async () => {
    if (!form.story.trim() || form.story.trim().length < 10) { toast.error('Write at least a few words first.'); return; }
    setEnhancing(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ mode: 'enhance_story', story: form.story, name: form.name || 'Artisan', craft: form.craft }),
      });
      if (resp.status === 429) { toast.error('Too many requests'); return; }
      if (resp.status === 402) { toast.error('AI credits exhausted'); return; }
      const data = await resp.json();
      if (data.result) { setForm({ ...form, story: data.result }); toast.success('Story enhanced ✨'); }
    } catch { toast.error('Enhancement failed'); }
    finally { setEnhancing(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to publish your card.');
      navigate({ to: '/auth' });
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }

    setSubmitting(true);
    let photo_url: string | undefined = photoPreview.startsWith('http') ? photoPreview : undefined;

    if (photo) {
      const ext = photo.name.split('.').pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('artisan-photos').upload(path, photo, { upsert: true });
      if (upErr) { setSubmitting(false); toast.error(upErr.message); return; }
      photo_url = supabase.storage.from('artisan-photos').getPublicUrl(path).data.publicUrl;
    }

    const payload = {
      user_id: user.id,
      name: parsed.data.name,
      craft: parsed.data.craft,
      specialty: parsed.data.specialty,
      story: parsed.data.story,
      experience: parsed.data.experience,
      location: parsed.data.location,
      contact: parsed.data.contact || null,
      products: parsed.data.products
        ? parsed.data.products.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      photo_url: photo_url ?? null,
      published: true,
    };

    const { error } = existingId
      ? await supabase.from('artisan_profiles').update(payload).eq('id', existingId)
      : await supabase.from('artisan_profiles').insert(payload);

    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success(existingId ? 'Profile updated!' : 'Your artisan card is now live!');
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to site</Link>
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">
              {existingId ? 'Update Your Artisan Profile' : 'Register as an Artisan'}
            </CardTitle>
            <CardDescription>
              Share your craft with the world. Your card will appear on the homepage instantly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Photo (you or your work)</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted">
                    {photoPreview ? (
                      <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <Input type="file" accept="image/*" onChange={handlePhotoChange} className="flex-1" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Craft *</Label>
                  <Select value={form.craft} onValueChange={(v) => setForm({ ...form, craft: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="silk">🧵 Silk</SelectItem>
                      <SelectItem value="wood">🪵 Wood Carving</SelectItem>
                      <SelectItem value="pottery">🏺 Pottery</SelectItem>
                      <SelectItem value="painting">🖼️ Painting</SelectItem>
                      <SelectItem value="sandalwood">🪻 Sandalwood</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty *</Label>
                <Input id="specialty" placeholder="e.g. Traditional Mysuru Silk Sarees" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="story">Your Story *</Label>
                  <Button type="button" size="sm" variant="outline" onClick={enhanceStory} disabled={enhancing}>
                    {enhancing ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                    Enhance with AI
                  </Button>
                </div>
                <Textarea id="story" rows={4} placeholder="Tell visitors about your craft and journey..." value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} required />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience *</Label>
                  <Input id="experience" placeholder="e.g. 25 years" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input id="location" placeholder="e.g. Kuvempunagar, Mysuru" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact (optional)</Label>
                <Input id="contact" placeholder="Phone, email, or 'Visit workshop'" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="products">Products (comma-separated)</Label>
                <Input id="products" placeholder="e.g. Bridal sarees, Temple sarees, Custom designs" value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })} />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {existingId ? 'Update Profile' : 'Publish My Card'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterArtisan;
