export const NICHES = {
  Lifestyle: ['Minimalism', 'Luxury Living', 'DIY & Crafts', 'Home Decor'],
  Tech: ['AI & Machine Learning', 'Web Development', 'Gadget Reviews', 'Crypto & Web3'],
  Fitness: ['Yoga', 'CrossFit', 'Bodybuilding', 'Running', 'Calisthenics'],
  Fashion: ['Streetwear', 'Sustainable Fashion', 'Luxury Fashion', 'Vintage'],
  Business: ['Entrepreneurship', 'Marketing', 'Finance', 'Productivity'],
  Gaming: ['Esports', 'Mobile Gaming', 'Streaming', 'Game Development'],
  Food: ['Vegan', 'Baking', 'Restaurant Reviews', 'Meal Prep'],
} as const;

export type NicheCategory = keyof typeof NICHES;
export type SubNiche<T extends NicheCategory> = typeof NICHES[T][number];

export const CHALLENGES = [
  {
    id: 'signal',
    difficulty: 'Easy',
    name: 'The Signal',
    description: 'Share 1 tribe-mate\'s post to your Story + Comment',
    action: 'Share 1 tribe-mate\'s post to your Story and leave a supportive comment',
    verification: 'API check for @mention in Story/Media',
    points: 10,
    color: '#00FF87',
  },
  {
    id: 'hook',
    difficulty: 'Medium',
    name: 'The Hook',
    description: 'Create a 15s video reacting or dueting a tribe-mate',
    action: 'Create a 15-second reaction video or duet with a tribe-mate\'s content',
    verification: 'Link submission + Caption keyword check',
    points: 25,
    color: '#FFB800',
  },
  {
    id: 'masterpiece',
    difficulty: 'Hard',
    name: 'The Masterpiece',
    description: 'A co-authored Collab Post or shared video series',
    action: 'Create a collaborative post or video series with your tribe',
    verification: 'Validates Collab Partner ID via Graph API',
    points: 50,
    color: '#8A2BE2',
  },
] as const;

export const POSTING_FREQUENCIES = [
  '1-2 times per week',
  '3-4 times per week',
  '5-7 times per week',
  'Daily',
] as const;

export const FOLLOWER_BRACKETS = [
  { label: 'Nano (1K-10K)', value: 'nano' },
  { label: 'Micro (10K-50K)', value: 'micro' },
  { label: 'Mid (50K-500K)', value: 'mid' },
  { label: 'Macro (500K+)', value: 'macro' },
] as const;

export const VIBES = [
  { id: 'authentic', label: 'Authentic', emoji: '✨' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡' },
  { id: 'chill', label: 'Chill', emoji: '🌊' },
  { id: 'professional', label: 'Professional', emoji: '💼' },
  { id: 'creative', label: 'Creative', emoji: '🎨' },
  { id: 'inspiring', label: 'Inspiring', emoji: '🚀' },
  { id: 'fun', label: 'Fun', emoji: '🎉' },
  { id: 'educational', label: 'Educational', emoji: '📚' },
] as const;
