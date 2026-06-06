export interface Trail {
  id: string;
  name: string;
  tagline: string;
  description: string;
  duration: string;
  distance: string;
  stops: string[];
  highlights: string[];
  bestFor: string[];
  startPoint: string;
  coordinates: [number, number];
  relatedPlaceIds: string[]; // IDs of places on this trail
  relatedArtisanIds?: string[]; // IDs of artisans on this trail
}

export const trails: Trail[] = [
  {
    id: 'silk-craft-trail',
    name: 'Silk & Craft Trail',
    tagline: 'Journey through the threads of tradition',
    description: 'Explore the living heritage of Mysuru silk weaving. Visit master weavers, understand the intricate process from cocoon to saree, and witness craftsmanship unchanged for centuries.',
    duration: '4-5 hours',
    distance: '8 km',
    stops: ['Kuvempunagar Silk Cluster', 'Chamundi Foothill Weavers', 'Devaraja Market Silk Shops'],
    highlights: ['Live weaving demonstration', 'Meet master artisans', 'Understand silk grading', 'Direct purchase opportunity'],
    bestFor: ['Art enthusiasts', 'Culture seekers', 'Shoppers'],
    startPoint: 'Kuvempunagar Silk Cluster',
    coordinates: [12.2867, 76.6189],
    relatedPlaceIds: ['silk-weaving-kuvempunagar', 'chamundi-foothill-villages', 'devaraja-market'],
    relatedArtisanIds: ['rajanna-silk', 'gowramma-silk']
  },
  {
    id: 'heritage-street-walk',
    name: 'Old Mysuru Street Culture Walk',
    tagline: 'Walk through centuries of living history',
    description: 'Navigate the narrow lanes of old Mysuru, discovering hidden temples, traditional architecture, and the authentic rhythm of daily life in this historic city.',
    duration: '3-4 hours',
    distance: '5 km',
    stops: ['Mandi Mohalla', 'Ashoka Road Heritage Zone', 'Brahmapura Agraharas', 'Gandhi Square'],
    highlights: ['Heritage architecture', 'Traditional eateries', 'Local interactions', 'Temple visits'],
    bestFor: ['History lovers', 'Photographers', 'Cultural explorers'],
    startPoint: 'Mandi Mohalla',
    coordinates: [12.3108, 76.6489],
    relatedPlaceIds: ['mandi-mohalla', 'ashoka-road-heritage', 'agraharas-brahmapura', 'gandhi-square-food-street']
  },
  {
    id: 'nature-lakes-trail',
    name: 'Hidden Lakes & Nature Walk',
    tagline: 'Discover Mysuru\'s secret green spaces',
    description: 'Escape to the serene lakes and green corridors of Mysuru. Perfect for birdwatching, photography, and connecting with nature away from tourist crowds.',
    duration: '5-6 hours',
    distance: '15 km (cycling recommended)',
    stops: ['Kukkarahalli Lake', 'Lingambudhi Lake', 'Chamundi Foothill Trails'],
    highlights: ['180+ bird species', 'Lotus blooms', 'Sunrise/sunset views', 'Nature photography'],
    bestFor: ['Nature lovers', 'Birdwatchers', 'Photographers', 'Wellness seekers'],
    startPoint: 'Kukkarahalli Lake',
    coordinates: [12.3167, 76.6333],
    relatedPlaceIds: ['kukkarahalli-lake', 'lingambudhi-lake', 'chamundi-foothill-villages']
  },
  {
    id: 'artisan-trail',
    name: 'Master Artisan Trail',
    tagline: 'Meet the hands that shape heritage',
    description: 'A curated journey through Mysuru\'s artisan clusters. From silk weavers to wood carvers, pottery makers to traditional painters - meet the masters keeping ancient crafts alive.',
    duration: 'Full day (6-8 hours)',
    distance: '20 km',
    stops: ['Silk Weaving Cluster', 'Wood Carving Workshop', 'Pottery Village', 'Sandalwood Artisans'],
    highlights: ['Multiple craft forms', 'Hands-on workshops', 'Artisan stories', 'Authentic purchases'],
    bestFor: ['Art collectors', 'Cultural enthusiasts', 'Craft learners'],
    startPoint: 'Kuvempunagar',
    coordinates: [12.2867, 76.6189],
    relatedPlaceIds: ['silk-weaving-kuvempunagar', 'wood-carving-somanathapura', 'pottery-cluster-bannimantap'],
    relatedArtisanIds: ['rajanna-silk', 'nagesh-woodcarving', 'lakshmi-pottery', 'venkatesh-painting', 'chandrashekar-sandalwood']
  },
  {
    id: 'food-heritage-trail',
    name: 'Mysuru Food Heritage Trail',
    tagline: 'Taste the flavors of royal Mysuru',
    description: 'Discover the culinary heritage of Mysuru through its legendary establishments. From the birthplace of Mysore Pak to century-old coffee houses and traditional thali restaurants.',
    duration: '4-5 hours',
    distance: '4 km',
    stops: ['Gandhi Square Food Street', 'Devaraja Market Snacks', 'Ashoka Road Sweet Shops', 'Traditional Thali Houses'],
    highlights: ['Original Mysore Pak', 'Filter coffee culture', 'Street food exploration', 'Traditional thalis'],
    bestFor: ['Foodies', 'Culinary explorers', 'Family groups'],
    startPoint: 'Gandhi Square',
    coordinates: [12.3078, 76.6556],
    relatedPlaceIds: ['gandhi-square-food-street', 'devaraja-market', 'ashoka-road-heritage', 'local-bakeries-craft-stores']
  }
];

export const getTrailIcon = (id: string): string => {
  switch (id) {
    case 'silk-craft-trail': return '🧵';
    case 'heritage-street-walk': return '🏛️';
    case 'nature-lakes-trail': return '🌿';
    case 'artisan-trail': return '🎨';
    case 'food-heritage-trail': return '🍛';
    default: return '📍';
  }
};
