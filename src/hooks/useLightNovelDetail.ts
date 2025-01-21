import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface Chapter {
  id: number;
  title: string;
  content: string;
  orderIndex: number;
}

interface LightNovelDetail {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  chapters: Chapter[];
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  tags: { name: string }[];
  createdAt: string;
  views: number;
  likes: number;
  status: string;
}

export function useLightNovelDetail(id: string | undefined) {
  const { user } = useAuth();
  const [novel, setNovel] = useState<LightNovelDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isLiked, setIsLiked] = useState(false);
  const [bookmarkedChapters, setBookmarkedChapters] = useState<number[]>([]);

  useEffect(() => {
    const fetchNovelDetail = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/lightnovels/${id}`, {
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        if (!response.ok) throw new Error('Failed to fetch light novel');
        const data = await response.json();
        setNovel(data);
        setIsLiked(data.isLiked || false);

        // Fetch bookmarked chapters
        if (user?.id) {
          const bookmarksResponse = await fetch(`http://localhost:3001/api/users/${user.id}/bookmarks`, {
            headers: {
              ...(token && { 'Authorization': `Bearer ${token}` })
            }
          });
          if (!bookmarksResponse.ok) throw new Error('Failed to fetch bookmarks');
          const bookmarksData = await bookmarksResponse.json();
          setBookmarkedChapters(bookmarksData.map((bookmark: any) => bookmark.chapterId));
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchNovelDetail();
    }
  }, [id, user]);

  return { novel, isLoading, error, isLiked, setIsLiked, bookmarkedChapters, setBookmarkedChapters };
}