export type PictureCategory = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  prompt: string;
};

export const PICTURE_CATEGORIES: PictureCategory[] = [
  {
    id: 'babies',
    label: 'Babies',
    emoji: '👶',
    description: 'Tiny humans being adorable',
    prompt: 'an adorable happy baby laughing with bright eyes, soft warm lighting, wholesome and sweet'
  },
  {
    id: 'ducklings',
    label: 'Ducklings',
    emoji: '🦆',
    description: 'Fluffy waddlers and pond cuteness',
    prompt: 'a fluffy yellow duckling waddling on green grass, extremely cute, soft focus'
  },
  {
    id: 'kittens',
    label: 'Kittens',
    emoji: '🐱',
    description: 'Playful paws and whisker boops',
    prompt: 'a tiny playful kitten with big eyes, fluffy fur, cozy and heartwarming'
  },
  {
    id: 'puppies',
    label: 'Puppies',
    emoji: '🐶',
    description: 'Tail wags and floppy ears',
    prompt: 'an adorable puppy with floppy ears wagging its tail, golden hour light, wholesome'
  },
  {
    id: 'buildings',
    label: 'Cute buildings',
    emoji: '🏠',
    description: 'Charming cottages and cozy corners',
    prompt: 'a charming tiny cottage with a round door, flower boxes, storybook cute architecture'
  },
  {
    id: 'flowers',
    label: 'Flowers',
    emoji: '🌸',
    description: 'Soft petals and blooming joy',
    prompt: 'a close-up of soft pink cherry blossoms, dreamy pastel colors, gentle and beautiful'
  },
  {
    id: 'baby-animals',
    label: 'Baby animals',
    emoji: '🐰',
    description: 'Bunnies, lambs, and more fuzz',
    prompt: 'a tiny baby bunny with soft fur sitting in clover, impossibly cute, warm tones'
  },
  {
    id: 'sunsets',
    label: 'Sunsets',
    emoji: '🌅',
    description: 'Golden skies and peaceful hues',
    prompt: 'a peaceful pastel sunset over a calm lake, soft pink and gold clouds, serene and lovely'
  },
  {
    id: 'miniatures',
    label: 'Miniature things',
    emoji: '🧸',
    description: 'Tiny objects that make you smile',
    prompt: 'a tiny teddy bear tea party on a mossy stump, miniature world, whimsical and cute'
  },
  {
    id: 'food',
    label: 'Cute food',
    emoji: '🍰',
    description: 'Sweet treats and happy plates',
    prompt: 'a adorable kawaii-style strawberry shortcake with a smiling face, pastel colors, sweet'
  }
];

export const VALID_CATEGORY_IDS = new Set(PICTURE_CATEGORIES.map((category) => category.id));

export function getCategoryById(id: string): PictureCategory | undefined {
  return PICTURE_CATEGORIES.find((category) => category.id === id);
}

export function pickRandomCategoryId(categoryIds: string[]): string {
  return categoryIds[Math.floor(Math.random() * categoryIds.length)];
}
