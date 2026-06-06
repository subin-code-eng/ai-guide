import rajannaSilk from '@/assets/artisans/rajanna-silk.jpg';
import nageshWoodcarving from '@/assets/artisans/nagesh-woodcarving.jpg';
import lakshmiPottery from '@/assets/artisans/lakshmi-pottery.jpg';
import venkateshPainting from '@/assets/artisans/venkatesh-painting.jpg';
import chandrashekarSandalwood from '@/assets/artisans/chandrashekar-sandalwood.jpg';
import gowrammaSilk from '@/assets/artisans/gowramma-silk.jpg';

const artisanImageMap: Record<string, string> = {
  'rajanna-silk': rajannaSilk,
  'nagesh-woodcarving': nageshWoodcarving,
  'lakshmi-pottery': lakshmiPottery,
  'venkatesh-painting': venkateshPainting,
  'chandrashekar-sandalwood': chandrashekarSandalwood,
  'gowramma-silk': gowrammaSilk,
};

export const getArtisanImage = (artisanId: string, fallback?: string): string => {
  return artisanImageMap[artisanId] || fallback || '/placeholder.svg';
};
