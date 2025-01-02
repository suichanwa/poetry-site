export interface DigitalProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  type: 'COMIC' | 'LIGHT_NOVEL' | 'MANGA';
  coverImage?: string;
  authorId: number;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  chapters?: Chapter[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: number;
  title: string;
  content?: string;
  images?: string[];
  productId: number;
  orderIndex: number;
  price?: number;
}