import { NicheCategory } from '@/constants/data';

export type UserType = 'creator' | 'brand' | null;

export interface CreatorProfile {
  id: string;
  name: string;
  bio: string;
  location: string;
  niches: { category: NicheCategory; subNiche: string }[];
  postingFrequency: string;
  openToIRL: boolean;
  followerCount: number;
  followerGrowth: number;
  engagementRate: number;
  allyScore: number;
  vibe: string;
  platformsBadges: {
    instagram: boolean;
    tiktok: boolean;
    youtube: boolean;
    facebook: boolean;
  };
  tribe?: {
    id: string;
    name: string;
    memberCount: number;
    isMatchingOpen: boolean;
  };
  isLookingForTribe: boolean;
}

export interface BrandProfile {
  id: string;
  name: string;
  industry: string;
  budgetBracket: string;
  targetCreatorSize: string;
  primaryGoal: string;
}

export interface Challenge {
  id: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  name: string;
  description: string;
  points: number;
  color: string;
  completed?: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface TribeJoinRequest {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorFollowers: number;
  creatorNiches: { category: NicheCategory; subNiche: string }[];
  message: string;
  timestamp: number;
}

export interface Tribe {
  id: string;
  name: string;
  members: CreatorProfile[];
  isMatchingOpen: boolean;
  createdAt: number;
  totalAllyScore: number;
  rankings: {
    byNiche: { rank: number; total: number };
    byFollowers: { rank: number; total: number };
    byLocation: { rank: number; total: number };
  };
}
