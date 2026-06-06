import silkCraftTrail from '@/assets/trails/silk-craft-trail.jpg';
import heritageStreetWalk from '@/assets/trails/heritage-street-walk.jpg';
import natureLakesTrail from '@/assets/trails/nature-lakes-trail.jpg';
import artisanTrail from '@/assets/trails/artisan-trail.jpg';
import foodHeritageTrail from '@/assets/trails/food-heritage-trail.jpg';

const trailImageMap: Record<string, string> = {
  'silk-craft-trail': silkCraftTrail,
  'heritage-street-walk': heritageStreetWalk,
  'nature-lakes-trail': natureLakesTrail,
  'artisan-trail': artisanTrail,
  'food-heritage-trail': foodHeritageTrail,
};

export const getTrailImage = (trailId: string): string => {
  return trailImageMap[trailId] || '/placeholder.svg';
};
