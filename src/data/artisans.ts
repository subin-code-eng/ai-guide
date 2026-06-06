export type CraftType = 'silk' | 'wood' | 'pottery' | 'painting' | 'sandalwood';

export interface Artisan {
  id: string;
  name: string;
  craft: CraftType;
  specialty: string;
  story: string;
  experience: string;
  location: string;
  coordinates: [number, number];
  contact?: string;
  image: string;
  products: string[];
}

export const artisans: Artisan[] = [
  {
    id: 'rajanna-silk',
    name: 'Shri Rajanna & Sons',
    craft: 'silk',
    specialty: 'Traditional Mysuru Silk Sarees with Kasuti Embroidery',
    story: 'For four generations, our family has woven dreams into silk. My grandfather learned from the royal weavers of the Wodeyar court. Each saree takes 15-45 days to complete, with every thread placed with intention and prayer.',
    experience: '65+ years family tradition',
    location: 'Kuvempunagar Silk Cluster',
    coordinates: [12.2867, 76.6189],
    contact: 'Visit workshop directly',
    image: '/placeholder.svg',
    products: ['Bridal sarees', 'Temple sarees', 'Pure zari work', 'Custom designs']
  },
  {
    id: 'nagesh-woodcarving',
    name: 'Master Nagesh Acharya',
    craft: 'wood',
    specialty: 'Hoysala-Style Rosewood Sculptures',
    story: 'I began carving at age 12, sitting beside my father. The Hoysala temples taught us that every detail matters. When I carve a deity, I fast and meditate - the wood must feel the devotion.',
    experience: '45 years',
    location: 'Somanathapura Road Workshop',
    coordinates: [12.2756, 76.8894],
    image: '/placeholder.svg',
    products: ['Temple sculptures', 'Door panels', 'Decorative items', 'Commissioned works']
  },
  {
    id: 'lakshmi-pottery',
    name: 'Lakshmi Devi Kumbhar',
    craft: 'pottery',
    specialty: 'Traditional Festival Pottery & Terracotta Art',
    story: 'My hands have known clay for 50 years. Before Diwali, the whole village comes for lamps. I still use the same wheel my grandmother used - it knows the rhythm of our family.',
    experience: '50 years',
    location: 'Bannimantap Pottery Village',
    coordinates: [12.3289, 76.6678],
    image: '/placeholder.svg',
    products: ['Festival lamps', 'Ceremonial items', 'Decorative pottery', 'Garden art']
  },
  {
    id: 'venkatesh-painting',
    name: 'Venkatesh Shilpi',
    craft: 'painting',
    specialty: 'Mysore Traditional Painting with Gold Leaf',
    story: 'Mysore painting uses natural colors and real gold. I grind my own pigments from stones and minerals. Each painting is first drawn, then layered with gesso, then painted, then gold is applied. Patience is everything.',
    experience: '35 years',
    location: 'Ashoka Road Art Lane',
    coordinates: [12.3052, 76.6512],
    image: '/placeholder.svg',
    products: ['Religious paintings', 'Royal portraits', 'Gold leaf works', 'Custom commissions']
  },
  {
    id: 'chandrashekar-sandalwood',
    name: 'C.R. Chandrashekar',
    craft: 'sandalwood',
    specialty: 'Sandalwood Carving & Inlay Work',
    story: 'Mysuru sandalwood is world-famous for its fragrance. I learned from the craftsmen who made pieces for the Mysore Palace. Each piece is carved, polished, and the natural oils are preserved through traditional methods.',
    experience: '40 years',
    location: 'Devaraja Market Area',
    coordinates: [12.3095, 76.6521],
    image: '/placeholder.svg',
    products: ['Deity sculptures', 'Jewelry boxes', 'Decorative items', 'Essential oils']
  },
  {
    id: 'gowramma-silk',
    name: 'Gowramma Weavers Collective',
    craft: 'silk',
    specialty: 'Women-Led Silk Weaving Cooperative',
    story: 'We are 15 women weavers who came together to preserve our craft and support our families. Each of us brings a unique style - some excel in borders, others in pallus. Together, we create masterpieces.',
    experience: '20+ years collective',
    location: 'Chamundi Foothill Area',
    coordinates: [12.2722, 76.6701],
    image: '/placeholder.svg',
    products: ['Collaborative sarees', 'Silk stoles', 'Table linens', 'Contemporary designs']
  }
];

export const getCraftIcon = (craft: CraftType): string => {
  switch (craft) {
    case 'silk': return '🧵';
    case 'wood': return '🪵';
    case 'pottery': return '🏺';
    case 'painting': return '🖼️';
    case 'sandalwood': return '🪻';
  }
};

export const getCraftColor = (craft: CraftType): string => {
  switch (craft) {
    case 'silk': return 'bg-heritage-gold text-secondary-foreground';
    case 'wood': return 'bg-terracotta text-primary-foreground';
    case 'pottery': return 'bg-sandalwood text-foreground';
    case 'painting': return 'bg-heritage-maroon text-primary-foreground';
    case 'sandalwood': return 'bg-cream text-foreground border border-heritage-gold';
  }
};
