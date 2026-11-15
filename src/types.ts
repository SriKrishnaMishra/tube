export interface ContentRecord {
  id: string;
  videoId: string;
  title: string;
  channel: string;
  domain?: string;
  category: string;
  subcategoryId?: number;
  timestamp: number;
  source: 'home' | 'sidebar' | 'search' | 'trending';
  duration?: number;
  url?: string;
  thumbnailUrl?: string;
  viewCount?: number;
  likes?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  tags?: string[];
  playlistId?: string;
  playlistTitle?: string;
}

export interface BlockRule {
  id: string;
  type: 'keyword' | 'channel' | 'category';
  value: string;
  createdAt: number;
}

export interface DashboardStats {
  total: number;
  topChannels: { channel: string; count: number }[];
  topCategories: { category: string; count: number }[];
  sourceCounts: Record<string, number>;
  dailyActivity: { date: string; count: number }[];
  recent: ContentRecord[];
  blockedCount: number;
}

export type TabId =
  | 'landing'
  | 'channels'
  | 'dashboard'
  | 'tracking'
  | 'blocking'
  | 'analytics'
  | 'browser'
  | 'recommendations'
  | 'discovery'
  | 'settings';

export interface ChannelPlaylist {
  id: string;
  channelId: string;
  channelName: string;
  title: string;
  description?: string;
  playlistId: string;
  playlistUrl?: string;
  thumbnailUrl: string;
  videoCount: number;
  videos: ContentRecord[];
}

export interface TrackedChannel {
  id: string;
  name: string;
  handle?: string;
  avatarUrl?: string;
  domain?: string;
  category?: string;
  subcategoryId?: number;
  subscriberCount?: string;
  description?: string;
  videoCount?: number;
  addedAt: number;
  playlistUrl?: string;
  tags?: string[];
  playlists?: ChannelPlaylist[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert' | 'video';
  timestamp: number;
  url?: string;
  read?: boolean;
}

export type ThemeMode = 'dark' | 'light' | 'cyberpunk' | 'emerald' | 'sunset';

export type DatePreset = 'all' | 'today' | 'week' | 'month' | 'quarter' | 'custom';

export interface DateFilterState {
  preset: DatePreset;
  startDate?: string;
  endDate?: string;
  recencyWeight: number; // 0 to 1
}

export type RecommendationStrategy = 'hybrid' | 'affinity' | 'collaborative' | 'trending' | 'groq';

export interface ScoredRecommendation extends ContentRecord {
  score: number;
  reason: string;
  matchType: 'content' | 'affinity' | 'interaction' | 'trending';
  affinitySourceCategory?: string;
}

export interface UserInteraction {
  videoId: string;
  type: 'view' | 'like' | 'save' | 'dismiss';
  categoryId?: number;
  categoryName?: string;
  timestamp: number;
}
