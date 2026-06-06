// Place images mapping
import mysorePalace from '@/assets/places/mysore-palace.jpg';
import chamundiHillTemple from '@/assets/places/chamundi-hill-temple.jpg';
import brindavanGardens from '@/assets/places/brindavan-gardens.jpg';
import stPhilomenasChurch from '@/assets/places/st-philomenas-church.jpg';
import mysuruZoo from '@/assets/places/mysuru-zoo.jpg';
import devarajaMarket from '@/assets/places/devaraja-market.jpg';
import mandiMohalla from '@/assets/places/mandi-mohalla.jpg';
import kukkarahalliLake from '@/assets/places/kukkarahalli-lake.jpg';
import ashokaRoadHeritage from '@/assets/places/ashoka-road-heritage.jpg';
import chamundiFoothillVillages from '@/assets/places/chamundi-foothill-villages.jpg';
import nandiViewpoint from '@/assets/places/nandi-viewpoint.jpg';
import srirangapatnaHeritage from '@/assets/places/srirangapatna-heritage.jpg';
import kaveriRiversideGhats from '@/assets/places/kaveri-riverside-ghats.jpg';
import ranganathittuOutskirts from '@/assets/places/ranganathittu-outskirts.jpg';
import lashkarMohalla from '@/assets/places/lashkar-mohalla.jpg';
import jaganmohanArtLane from '@/assets/places/jaganmohan-art-lane.jpg';
import karanjiLake from '@/assets/places/karanji-lake.jpg';
import silkWeavingKuvempunagar from '@/assets/places/silk-weaving-kuvempunagar.jpg';
import agraharasBrahmapura from '@/assets/places/agraharas-brahmapura.jpg';
import woodCarvingSomanathapura from '@/assets/places/wood-carving-somanathapura.jpg';
import lingambudhiLake from '@/assets/places/lingambudhi-lake.jpg';
import potteryClusterBannimantap from '@/assets/places/pottery-cluster-bannimantap.jpg';
import gandhiSquareFoodStreet from '@/assets/places/gandhi-square-food-street.jpg';
import localFlowerYards from '@/assets/places/local-flower-yards.jpg';
import localBakeriesCraftStores from '@/assets/places/local-bakeries-craft-stores.jpg';

export const placeImages: Record<string, string> = {
  'mysore-palace': mysorePalace,
  'chamundi-hill-temple': chamundiHillTemple,
  'brindavan-gardens': brindavanGardens,
  'st-philomenas-church': stPhilomenasChurch,
  'mysuru-zoo': mysuruZoo,
  'devaraja-market': devarajaMarket,
  'mandi-mohalla': mandiMohalla,
  'kukkarahalli-lake': kukkarahalliLake,
  'ashoka-road-heritage': ashokaRoadHeritage,
  'chamundi-foothill-villages': chamundiFoothillVillages,
  'nandi-viewpoint': nandiViewpoint,
  'srirangapatna-heritage': srirangapatnaHeritage,
  'kaveri-riverside-ghats': kaveriRiversideGhats,
  'ranganathittu-outskirts': ranganathittuOutskirts,
  'lashkar-mohalla': lashkarMohalla,
  'jaganmohan-art-lane': jaganmohanArtLane,
  'karanji-lake': karanjiLake,
  'silk-weaving-kuvempunagar': silkWeavingKuvempunagar,
  'agraharas-brahmapura': agraharasBrahmapura,
  'wood-carving-somanathapura': woodCarvingSomanathapura,
  'lingambudhi-lake': lingambudhiLake,
  'pottery-cluster-bannimantap': potteryClusterBannimantap,
  'gandhi-square-food-street': gandhiSquareFoodStreet,
  'local-flower-yards': localFlowerYards,
  'local-bakeries-craft-stores': localBakeriesCraftStores,
};

export const getPlaceImage = (placeId: string): string => {
  return placeImages[placeId] || '/placeholder.svg';
};