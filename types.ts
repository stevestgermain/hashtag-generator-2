export type HashtagCategoryType = 'Niche' | 'Broad' | 'Related';

export interface HashtagItem {
  tag: string;
  category: HashtagCategoryType;
  reach: string; // e.g., "500K", "1.2M"
  relevance: number; // 1-100 score
}

export interface HashtagResult {
  items: HashtagItem[];
}
