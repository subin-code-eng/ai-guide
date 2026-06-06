export type PlaceCategory = 'heritage' | 'art' | 'nature' | 'food' | 'culture';
export type CrowdLevel = 'low' | 'medium' | 'high';

export interface Place {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: PlaceCategory;
  coordinates: [number, number]; // [lat, lng]
  crowdLevel: CrowdLevel;
  bestTime: string;
  image: string;
  highlights: string[];
  redirectMessage?: string; // Optional message for high-crowd places to redirect visitors
  nearbyAlternatives?: string[]; // IDs of nearby low-crowd alternatives
}

export const places: Place[] = [
  // ========== POPULAR PLACES (HIGH CROWD) - Used as anchors for redirection ==========
  {
    id: 'mysore-palace',
    name: 'Mysore Palace',
    description: 'Iconic royal palace and major tourist attraction. Consider nearby heritage streets for authentic experience.',
    longDescription: 'The Mysore Palace is the most famous landmark in Karnataka. While magnificent, it experiences extremely high footfall. Our system recommends nearby heritage zones for a more intimate experience.',
    category: 'heritage',
    coordinates: [12.3052, 76.6552],
    crowdLevel: 'high',
    bestTime: 'Early morning (avoid weekends)',
    image: '/placeholder.svg',
    highlights: ['Royal architecture', 'Light show evenings', 'Historical significance', 'Museum collections'],
    redirectMessage: 'This area is crowded. Explore nearby heritage streets to experience authentic Mysuru.',
    nearbyAlternatives: ['ashoka-road-heritage', 'agraharas-brahmapura', 'jaganmohan-art-lane']
  },
  {
    id: 'chamundi-hill-temple',
    name: 'Chamundi Hill Temple',
    description: 'Sacred hilltop temple with panoramic views. Foothill villages offer spiritual alternatives.',
    longDescription: 'Chamundi Hill Temple is a major pilgrimage site with heavy tourist traffic. The foothill villages and lower trail areas offer equally spiritual experiences with fewer crowds.',
    category: 'culture',
    coordinates: [12.2722, 76.6770],
    crowdLevel: 'high',
    bestTime: 'Very early morning (5-6 AM)',
    image: '/placeholder.svg',
    highlights: ['Goddess Chamundeshwari', 'Nandi statue', 'City views', 'Temple architecture'],
    redirectMessage: 'Discover spiritual and village life away from the peak crowd.',
    nearbyAlternatives: ['chamundi-foothill-villages', 'nandi-viewpoint', 'wood-carving-somanathapura']
  },
  {
    id: 'brindavan-gardens',
    name: 'Brindavan Gardens',
    description: 'Famous musical fountain gardens. River ghats and heritage zones nearby offer peaceful alternatives.',
    longDescription: 'Brindavan Gardens attracts massive crowds especially during evening fountain shows. Kaveri riverside ghats and Srirangapatna heritage areas provide serene alternatives.',
    category: 'nature',
    coordinates: [12.4214, 76.5729],
    crowdLevel: 'high',
    bestTime: 'Weekday mornings',
    image: '/placeholder.svg',
    highlights: ['Musical fountain', 'Landscaped gardens', 'KRS Dam views', 'Boating'],
    redirectMessage: 'Explore heritage and river culture beyond the garden crowd.',
    nearbyAlternatives: ['srirangapatna-heritage', 'kaveri-riverside-ghats', 'ranganathittu-outskirts']
  },
  {
    id: 'st-philomenas-church',
    name: "St. Philomena's Church",
    description: 'Neo-Gothic cathedral and major landmark. Historic neighbourhoods nearby offer authentic experiences.',
    longDescription: 'One of the largest churches in Asia, St. Philomena\'s draws significant crowds. The surrounding Mandi Mohalla and Lashkar Mohalla areas preserve old Mysuru community heritage.',
    category: 'heritage',
    coordinates: [12.3186, 76.6553],
    crowdLevel: 'high',
    bestTime: 'Weekday mornings',
    image: '/placeholder.svg',
    highlights: ['Gothic architecture', 'Stained glass', 'Underground crypt', 'Twin spires'],
    redirectMessage: 'Walk through historic neighbourhoods shaped by old Mysuru communities.',
    nearbyAlternatives: ['mandi-mohalla', 'lashkar-mohalla', 'local-bakeries-craft-stores']
  },
  {
    id: 'mysuru-zoo',
    name: 'Mysuru Zoo',
    description: 'One of India\'s oldest zoos. Nearby lakes offer calm green spaces with rich birdlife.',
    longDescription: 'Mysuru Zoo is extremely popular with families and tourists. For nature lovers, the nearby lakes - Karanji, Lingambudhi, and Kukkarahalli - offer peaceful alternatives with diverse wildlife.',
    category: 'nature',
    coordinates: [12.3019, 76.6631],
    crowdLevel: 'high',
    bestTime: 'Weekday mornings',
    image: '/placeholder.svg',
    highlights: ['Wildlife conservation', 'Historic zoo', 'Varied species', 'Educational tours'],
    redirectMessage: 'Choose calm green spaces and bird habitats instead of busy attractions.',
    nearbyAlternatives: ['karanji-lake', 'lingambudhi-lake', 'kukkarahalli-lake']
  },
  
  // ========== HIDDEN GEMS & ALTERNATIVES (LOW/MEDIUM CROWD) ==========
  {
    id: 'devaraja-market',
    name: 'Devaraja Market',
    description: 'Historic 150-year-old market with local artisans selling traditional goods, spices, and flowers.',
    longDescription: 'One of the oldest and most vibrant markets in South India, Devaraja Market has been the heart of Mysuru trade since 1886. Wander through lanes filled with fragrant jasmine, fresh produce, traditional silk, and local handicrafts.',
    category: 'culture',
    coordinates: [12.3095, 76.6521],
    crowdLevel: 'medium',
    bestTime: 'Early morning (6-9 AM)',
    image: '/placeholder.svg',
    highlights: ['Traditional flower vendors', 'Spice traders', 'Sandalwood products', 'Local snacks'],
    redirectMessage: 'Support artisans directly at their craft locations.'
  },
  {
    id: 'mandi-mohalla',
    name: 'Mandi Mohalla',
    description: 'Ancient trade quarter with narrow lanes, traditional architecture, and local craft workshops.',
    longDescription: 'This centuries-old neighborhood was the commercial hub during the Wodeyar dynasty. Today, it preserves the essence of old Mysuru with its winding lanes, traditional homes, and artisan workshops.',
    category: 'heritage',
    coordinates: [12.3108, 76.6489],
    crowdLevel: 'low',
    bestTime: 'Morning (8-11 AM)',
    image: '/placeholder.svg',
    highlights: ['Traditional architecture', 'Local artisans', 'Authentic street food', 'Heritage walks']
  },
  {
    id: 'kukkarahalli-lake',
    name: 'Kukkarahalli Lake',
    description: 'Serene lake surrounded by walking trails, diverse birdlife, and peaceful green spaces.',
    longDescription: 'A hidden gem managed by the University of Mysore, this 58-hectare lake is home to over 180 species of birds. Perfect for morning walks, birdwatching, and escaping the city bustle.',
    category: 'nature',
    coordinates: [12.3167, 76.6333],
    crowdLevel: 'low',
    bestTime: 'Dawn (5:30-7 AM) or Dusk',
    image: '/placeholder.svg',
    highlights: ['180+ bird species', 'Nature trails', 'Lotus ponds', 'Photography spots']
  },
  {
    id: 'ashoka-road-heritage',
    name: 'Ashoka Road Heritage Street',
    description: 'Colonial-era boulevard with heritage buildings, local shops, and traditional eateries.',
    longDescription: 'Named after Emperor Ashoka, this tree-lined avenue showcases a blend of colonial and Mysuru architectural styles. Home to traditional sweet shops, silk stores, and iconic landmarks.',
    category: 'heritage',
    coordinates: [12.3052, 76.6512],
    crowdLevel: 'low',
    bestTime: 'Evening (4-7 PM)',
    image: '/placeholder.svg',
    highlights: ['Colonial architecture', 'Traditional sweet shops', 'Silk emporiums', 'Street photography']
  },
  {
    id: 'chamundi-foothill-villages',
    name: 'Chamundi Foothill Villages',
    description: 'Traditional villages at the base of Chamundi Hill with rural life experiences.',
    longDescription: 'Away from the tourist trail to Chamundi temple, these villages offer authentic rural Karnataka experiences. Meet local farmers, witness traditional crafts, and enjoy home-cooked meals.',
    category: 'culture',
    coordinates: [12.2722, 76.6701],
    crowdLevel: 'low',
    bestTime: 'Morning (7-10 AM)',
    image: '/placeholder.svg',
    highlights: ['Village homestays', 'Traditional farming', 'Local cuisine', 'Rural crafts']
  },
  {
    id: 'nandi-viewpoint',
    name: 'Nandi Viewpoint - Lower Trail',
    description: 'Peaceful lower trail area near the iconic Nandi statue with scenic views.',
    longDescription: 'Instead of the crowded hilltop, explore the lower trail areas around the Nandi statue. Enjoy panoramic views, quiet meditation spots, and connect with local devotees.',
    category: 'culture',
    coordinates: [12.2756, 76.6745],
    crowdLevel: 'low',
    bestTime: 'Early morning (6-8 AM)',
    image: '/placeholder.svg',
    highlights: ['Scenic views', 'Quiet trails', 'Local devotees', 'Nature walks']
  },
  {
    id: 'srirangapatna-heritage',
    name: 'Srirangapatna Heritage Zone',
    description: "Historic island town with Tipu Sultan's legacy, ancient temples, and river views.",
    longDescription: "Beyond the main fort, explore lesser-known monuments, riverside ghats, and local communities. The outskirts offer peaceful walks along the Kaveri river and authentic local experiences.",
    category: 'heritage',
    coordinates: [12.4181, 76.6947],
    crowdLevel: 'low',
    bestTime: 'Morning or late afternoon',
    image: '/placeholder.svg',
    highlights: ['Riverside ghats', 'Hidden temples', 'Local fishing community', 'Bird sanctuary nearby']
  },
  {
    id: 'kaveri-riverside-ghats',
    name: 'Kaveri Riverside Ghats',
    description: 'Serene riverbanks with ancient bathing ghats and peaceful walking paths.',
    longDescription: 'These traditional ghats along the Kaveri offer tranquil morning experiences. Watch local rituals, enjoy the river breeze, and explore the surrounding heritage areas.',
    category: 'nature',
    coordinates: [12.4156, 76.6889],
    crowdLevel: 'low',
    bestTime: 'Early morning (5-8 AM)',
    image: '/placeholder.svg',
    highlights: ['River views', 'Morning rituals', 'Bird watching', 'Peaceful walks']
  },
  {
    id: 'ranganathittu-outskirts',
    name: 'Ranganathittu Outskirts Walking Paths',
    description: 'Quiet nature trails around the bird sanctuary with diverse flora and fauna.',
    longDescription: 'Beyond the main sanctuary boat rides, explore the lesser-known walking paths. Perfect for birdwatchers and nature enthusiasts seeking solitude.',
    category: 'nature',
    coordinates: [12.4233, 76.6567],
    crowdLevel: 'low',
    bestTime: 'Dawn (5:30-7 AM)',
    image: '/placeholder.svg',
    highlights: ['Walking trails', 'Bird watching', 'Nature photography', 'Quiet meditation']
  },
  {
    id: 'lashkar-mohalla',
    name: 'Lashkar Mohalla - Old Mysuru Streets',
    description: 'Historic military quarter with traditional homes, local eateries, and community life.',
    longDescription: 'Once home to the royal army, this neighborhood preserves centuries of Mysuru heritage. Explore narrow lanes, interact with local communities, and discover hidden stories.',
    category: 'heritage',
    coordinates: [12.3145, 76.6478],
    crowdLevel: 'low',
    bestTime: 'Morning (8-11 AM)',
    image: '/placeholder.svg',
    highlights: ['Historic homes', 'Local eateries', 'Community stories', 'Heritage architecture']
  },
  {
    id: 'jaganmohan-art-lane',
    name: 'Jaganmohan Art Lane',
    description: 'Quiet cultural stretch near Jaganmohan Palace with art galleries and craft shops.',
    longDescription: 'This peaceful lane adjacent to the Jaganmohan Palace art gallery features small studios, traditional craft shops, and local artists. A perfect escape from palace crowds.',
    category: 'art',
    coordinates: [12.3067, 76.6523],
    crowdLevel: 'low',
    bestTime: 'Afternoon (2-5 PM)',
    image: '/placeholder.svg',
    highlights: ['Art galleries', 'Local artists', 'Craft shops', 'Quiet atmosphere']
  },
  {
    id: 'karanji-lake',
    name: 'Karanji Lake',
    description: 'Large lake with butterfly park, nature trails, and diverse birdlife.',
    longDescription: 'Located behind the zoo, Karanji Lake offers a peaceful alternative. The butterfly park, walk-through aviary, and nature trails provide intimate nature experiences.',
    category: 'nature',
    coordinates: [12.2978, 76.6656],
    crowdLevel: 'low',
    bestTime: 'Early morning (6-8 AM)',
    image: '/placeholder.svg',
    highlights: ['Butterfly park', 'Walk-through aviary', 'Boating', 'Bird watching']
  },
  {
    id: 'silk-weaving-kuvempunagar',
    name: 'Kuvempunagar Silk Weaving Cluster',
    description: 'Traditional silk weaving community where master weavers create Mysuru silk sarees.',
    longDescription: 'Visit the homes of master weavers who have practiced the art of silk weaving for generations. Watch the intricate process of creating world-famous Mysuru silk, from dyeing to final weaving.',
    category: 'art',
    coordinates: [12.2867, 76.6189],
    crowdLevel: 'low',
    bestTime: 'Working hours (9 AM - 5 PM)',
    image: '/placeholder.svg',
    highlights: ['Live weaving demonstrations', 'Direct artisan interaction', 'Authentic silk purchase', 'Heritage craft']
  },
  {
    id: 'agraharas-brahmapura',
    name: 'Brahmapura Agraharas',
    description: 'Traditional Brahmin quarters with ancient temples, agrahara architecture, and rituals.',
    longDescription: 'These centuries-old Brahmin settlements preserve traditional South Indian culture. Explore ancient temples, witness morning rituals, and experience the timeless rhythms of temple town life.',
    category: 'culture',
    coordinates: [12.3023, 76.6445],
    crowdLevel: 'low',
    bestTime: 'Early morning (5-8 AM)',
    image: '/placeholder.svg',
    highlights: ['Ancient temples', 'Traditional rituals', 'Agrahara architecture', 'Spiritual atmosphere']
  },
  {
    id: 'wood-carving-somanathapura',
    name: 'Wood Carving Artisans - Somanathapura Road',
    description: 'Cluster of traditional wood carving workshops continuing centuries-old Hoysala traditions.',
    longDescription: 'Skilled artisans here create intricate rosewood and sandalwood carvings inspired by Hoysala temple art. Watch masters transform raw wood into divine sculptures and decorative pieces.',
    category: 'art',
    coordinates: [12.2756, 76.8894],
    crowdLevel: 'low',
    bestTime: 'Daytime (10 AM - 4 PM)',
    image: '/placeholder.svg',
    highlights: ['Hoysala-style carvings', 'Master craftsmen', 'Custom orders', 'Sandalwood works']
  },
  {
    id: 'lingambudhi-lake',
    name: 'Lingambudhi Lake',
    description: 'Pristine lake with migratory birds, lotus blooms, and serene walking paths.',
    longDescription: 'This lesser-known lake on the outskirts offers peaceful mornings with stunning lotus blooms and diverse birdlife. A favorite among local birdwatchers and nature photographers.',
    category: 'nature',
    coordinates: [12.2989, 76.6067],
    crowdLevel: 'low',
    bestTime: 'Dawn (5:30-7 AM)',
    image: '/placeholder.svg',
    highlights: ['Migratory birds', 'Lotus gardens', 'Sunrise views', 'Nature photography']
  },
  {
    id: 'pottery-cluster-bannimantap',
    name: 'Bannimantap Pottery Cluster',
    description: 'Traditional pottery village where artisans create terracotta art using ancient techniques.',
    longDescription: 'Generations of potters have shaped clay here using traditional wheel methods. Visit during the festival season to see the creation of ceremonial items, lamps, and decorative pottery.',
    category: 'art',
    coordinates: [12.3289, 76.6678],
    crowdLevel: 'low',
    bestTime: 'Morning (8-11 AM)',
    image: '/placeholder.svg',
    highlights: ['Traditional pottery', 'Hands-on workshops', 'Festival specials', 'Terracotta art']
  },
  {
    id: 'gandhi-square-food-street',
    name: 'Gandhi Square Food Heritage',
    description: 'Historic food street with generations-old eateries serving authentic Mysuru cuisine.',
    longDescription: 'This bustling square has been feeding Mysoreans for over a century. Find iconic establishments serving Mysore Pak, filter coffee, traditional thalis, and street snacks unchanged for generations.',
    category: 'food',
    coordinates: [12.3078, 76.6556],
    crowdLevel: 'medium',
    bestTime: 'Evening (5-9 PM)',
    image: '/placeholder.svg',
    highlights: ['Mysore Pak origins', 'Filter coffee', 'Traditional thalis', 'Street snacks']
  },
  {
    id: 'local-flower-yards',
    name: 'Local Flower Yards',
    description: 'Early morning flower markets where vendors prepare garlands and offerings.',
    longDescription: 'Before Devaraja Market gets crowded, the local flower yards buzz with activity. Watch skilled artisans create intricate garlands, experience the fragrance of fresh jasmine, and witness authentic market culture.',
    category: 'culture',
    coordinates: [12.3089, 76.6498],
    crowdLevel: 'low',
    bestTime: 'Very early morning (4-7 AM)',
    image: '/placeholder.svg',
    highlights: ['Fresh flowers', 'Garland making', 'Morning rituals', 'Authentic culture']
  },
  {
    id: 'local-bakeries-craft-stores',
    name: 'Heritage Bakeries & Craft Lane',
    description: 'Century-old bakeries and traditional craft stores near St. Philomenas area.',
    longDescription: 'These family-run establishments have served Mysuru for generations. Sample traditional breads, biscuits, and discover handmade crafts that tell stories of the local community.',
    category: 'food',
    coordinates: [12.3178, 76.6534],
    crowdLevel: 'low',
    bestTime: 'Morning (8-11 AM)',
    image: '/placeholder.svg',
    highlights: ['Traditional bakeries', 'Handmade crafts', 'Local stories', 'Community heritage']
  }
];

export const getCrowdColor = (level: CrowdLevel): string => {
  switch (level) {
    case 'low': return 'bg-silk-green text-accent-foreground';
    case 'medium': return 'bg-secondary text-secondary-foreground';
    case 'high': return 'bg-primary text-primary-foreground';
  }
};

// Get nearby alternatives for a high-crowd place
export const getNearbyAlternatives = (placeId: string): Place[] => {
  const place = places.find(p => p.id === placeId);
  if (!place || !place.nearbyAlternatives) return [];
  return place.nearbyAlternatives
    .map(altId => places.find(p => p.id === altId))
    .filter((p): p is Place => p !== undefined);
};

// Get high-crowd places with their alternatives
export const getHighCrowdPlaces = (): Place[] => {
  return places.filter(p => p.crowdLevel === 'high' && p.nearbyAlternatives);
};

export const getCategoryIcon = (category: PlaceCategory): string => {
  switch (category) {
    case 'heritage': return '🏛️';
    case 'art': return '🎨';
    case 'nature': return '🌿';
    case 'food': return '🍛';
    case 'culture': return '🪔';
  }
};

export const getCategoryColor = (category: PlaceCategory): string => {
  switch (category) {
    case 'heritage': return 'bg-heritage-maroon text-primary-foreground';
    case 'art': return 'bg-secondary text-secondary-foreground';
    case 'nature': return 'bg-silk-green text-accent-foreground';
    case 'food': return 'bg-terracotta text-primary-foreground';
    case 'culture': return 'bg-heritage-gold text-secondary-foreground';
  }
};
