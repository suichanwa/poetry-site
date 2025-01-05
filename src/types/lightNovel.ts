// src/types/lightNovel.ts
export interface LightNovel {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  tags: { name: string }[];
  chapters: Array<{
    id: number;
    title: string;
    content: string;
    orderIndex: number;
  }>;
  createdAt: string;
  views: number;
  likes: number;
  status: string;
}