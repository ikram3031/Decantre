import { Product, HeroSlide } from './types';

export const products: Product[] = [
  {
    id: 'oud-imperial',
    name: 'OUD IMPÉRIAL',
    tagline: 'Sovereign Leather & Golden Incense',
    category: 'For Him',
    basePrice: 180,
    description: 'A majestic statement of power and mystery. Rich Cambodian oud is intertwined with smoked birchwood, roasted saffron, and hand-burnished royal leather. A fragrance designed for the sovereign spirit.',
    scentFamily: 'Oud Woody',
    notes: {
      top: ['Spiced Cardamom', 'Saffron Thread', 'Pink Pepper'],
      heart: ['Royal Cambodian Oud', 'Myrrh Resin', 'Atlas Cedarwood'],
      base: ['Tuscan Leather', 'Smoky Vetiver', 'Warm Amber']
    },
    longevity: 5,
    sillage: 5,
    image: '/src/assets/images/perfume_for_him_1784311883603.jpg',
    isBestSeller: true,
    isFeatured: true
  },
  {
    id: 'nectar-de-saphir',
    name: 'NECTAR DE SAPHIR',
    tagline: 'Crystalline Rose & Velvet Orchid',
    category: 'For Her',
    basePrice: 165,
    description: 'An intoxicating bouquet of unparalleled grace. Delicate centifolia rose petals are steeped in organic honeyed nectar, laced with Madagascar vanilla orchid and soft sensual white musk. Absolute liquid jewel.',
    scentFamily: 'Sweet Floral Ambery',
    notes: {
      top: ['Bergamot Blossom', 'White Peach', 'Litchi Dew'],
      heart: ['Centifolia Rose', 'Damask Orchid', 'Night Jasmine'],
      base: ['Madagascar Vanilla Orchid', 'White Musk', 'Creamy Sandalwood']
    },
    longevity: 4,
    sillage: 4,
    image: '/src/assets/images/perfume_for_her_1784311895919.jpg',
    isBestSeller: false,
    isFeatured: true
  },
  {
    id: 'saffron-mystique',
    name: 'SAFFRON MYSTIQUE',
    tagline: 'The Radiant Alchemy of Golden Spices',
    category: 'Unisex',
    basePrice: 195,
    description: 'A luxurious olfactory tapestry blending high-altitude saffron with soft Cashmeran wool notes and dry cedarwood. Designed for those who walk between worlds and appreciate pure artistic chemistry.',
    scentFamily: 'Spicy Woody Amber',
    notes: {
      top: ['High Saffron', 'Nutmeg Essence', 'Mandarin Zest'],
      heart: ['Cashmeran Wood', 'Papyrus', 'Black Amber'],
      base: ['Agarwood Spark', 'Frankincense', 'Rich Tonka Bean']
    },
    longevity: 5,
    sillage: 4,
    image: '/src/assets/images/perfume_unisex_1784311906469.jpg',
    isBestSeller: true,
    isFeatured: true
  },
  {
    id: 'bergamote-sauvage',
    name: 'BERGAMOTE SAUVAGE',
    tagline: 'Calabrian Sunshine & Mineral Oakmoss',
    category: 'For Him',
    basePrice: 145,
    description: 'An energetic burst of windswept freedom. Cold-pressed Calabrian bergamot clashes with raw, salted vetiver roots, mineral oakmoss, and clean maritime air notes. Timeless, masculine elegance.',
    scentFamily: 'Citrus Woody Fresh',
    notes: {
      top: ['Calabrian Bergamot', 'Lime Zest', 'Grapefruit'],
      heart: ['Seawater Accord', 'Geranium Leaf', 'Black Pepper'],
      base: ['Mineral Oakmoss', 'Vetiver Roots', 'Sleek Patchouli']
    },
    longevity: 4,
    sillage: 4,
    image: '/src/assets/images/perfume_for_him_1784311883603.jpg',
    isBestSeller: false,
    isFeatured: false
  },
  {
    id: 'ambre-nuit',
    name: 'AMBRE NUIT',
    tagline: 'Smoky Orchid & Dark Golden Patchouli',
    category: 'Unisex',
    basePrice: 170,
    description: 'The sensual dance of dusk. Glowing resinous amber, velvet night orchid, and heavy earthy patchouli create a warm, dark, and protective second skin that comes alive as the sun disappears.',
    scentFamily: 'Earthy Amber Oriental',
    notes: {
      top: ['Dark Plum', 'Rum Accord', 'Cinnamon Bark'],
      heart: ['Black Amber Resin', 'Night Orchid', 'Tobacco Leaf'],
      base: ['Earthy Patchouli', 'Vanilla Absolue', 'Peruvian Balsam']
    },
    longevity: 5,
    sillage: 5,
    image: '/src/assets/images/perfume_unisex_1784311906469.jpg',
    isBestSeller: true,
    isFeatured: false
  },
  {
    id: 'rose-absolue',
    name: 'ROSE ABSOLUE',
    tagline: 'Velvet Pink Pepper & Precious Woods',
    category: 'For Her',
    basePrice: 155,
    description: 'A contemporary rose designed with sharp, sophisticated contrasts. Vibrant Sichuan pink pepper and sparkling berries illuminate a deep, woody base of rose absolute and smooth cream woods.',
    scentFamily: 'Spicy Velvet Rose',
    notes: {
      top: ['Sichuan Pink Pepper', 'Wild Blackberries', 'Red Currant'],
      heart: ['Turkish Rose Absolute', 'Damask Rose Oil', 'Peony'],
      base: ['Sleek Cedarwood', 'Precious Musk', 'Benzoin Balsam']
    },
    longevity: 4,
    sillage: 3,
    image: '/src/assets/images/perfume_for_her_1784311895919.jpg',
    isBestSeller: false,
    isFeatured: false
  }
];

export const slides: HeroSlide[] = [
  {
    title: "L'ÉLIXIR DE MAJESTÉ",
    subtitle: "The Sovereign Golden Oud",
    description: "A breathtaking encounter between golden royal saffron, deep Cambodian oud, and burnished leather. Experience the peak of luxurious scent chemistry.",
    bgImage: '/src/assets/images/luxury_perfume_hero_1784311872347.jpg',
    productId: 'oud-imperial'
  },
  {
    title: "SAFFRON MYSTIQUE",
    subtitle: "A Sacred Alchemy",
    description: "A modern classic designed in collaboration with elite French master perfumers. Deeply sophisticated, intensely persistent, and proudly unisex.",
    bgImage: '/src/assets/images/perfume_unisex_1784311906469.jpg',
    productId: 'saffron-mystique'
  },
  {
    title: "NECTAR DE SAPHIR",
    subtitle: "Unmatched Feminine Grace",
    description: "Crystalline rose buds drenched in sweet golden nectar and vanilla orchid. A vibrant aura that leaves an unforgettable trail of absolute elegance.",
    bgImage: '/src/assets/images/perfume_for_her_1784311895919.jpg',
    productId: 'nectar-de-saphir'
  }
];
