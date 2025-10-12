// src/types/video.ts
export type Video = {
  id: string;
  title: string;
  author?: string;
  rating?: number;
  reviews?: string;
  price?: string;
  originalPrice?: string;
  image?: string;
  isPremium?: boolean;
  isBestseller?: boolean;
  isFree?: boolean;
  // IMPORTANT: backend should return one (or both) of these
  hlsUrl?: string; // .m3u8
  mp4Url?: string; // direct mp4 fallback
  description?: string;
};
