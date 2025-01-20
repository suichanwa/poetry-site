// src/interfaces/bookInterfaces.ts

export interface BookDetail {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  views: number;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}