// src/pages/MangaDetailPage.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MangaReader } from "@/components/MangaReader";
import { LoadingState } from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface Chapter {
  id: number;
  title: string;
  orderIndex: number;
  pages: {
    id: number;
    imageUrl: string;
    pageNumber: number;
  }[];
}

interface MangaDetail {
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
}

export default function MangaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [manga, setManga] = useState<MangaDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    const fetchMangaDetail = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/api/manga/${id}`);
        if (!response.ok) throw new Error('Failed to fetch manga');
        const data = await response.json();
        setManga(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        console.error('Error fetching manga:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMangaDetail();
    }
  }, [id]);

  const handleReadChapter = (chapter: Chapter) => {
    setCurrentChapter(chapter);
    setIsReaderOpen(true);
  };

  const handleChapterChange = (chapterId: number) => {
    const chapter = manga?.chapters.find(c => c.id === chapterId);
    if (chapter) {
      setCurrentChapter(chapter);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error || !manga) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen p-6">
      <Card className="max-w-4xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cover Image */}
          <div className="aspect-[3/4] relative">
            <img
              src={manga.coverImage}
              alt={manga.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Manga Info */}
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-3xl font-bold">{manga.title}</h1>
            <p className="text-muted-foreground">{manga.description}</p>

            <div className="flex items-center gap-2">
              {manga.tags.map(tag => (
                <span
                  key={tag.name}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>

            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold mb-4">Chapters</h2>
              <div className="space-y-2">
                {manga.chapters.map(chapter => (
                  <Button
                    key={chapter.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleReadChapter(chapter)}
                  >
                    Chapter {chapter.orderIndex}: {chapter.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {isReaderOpen && currentChapter && (
        <MangaReader
          pages={currentChapter.pages}
          currentChapter={currentChapter}
          onChapterChange={handleChapterChange}
          onClose={() => setIsReaderOpen(false)}
        />
      )}
    </div>
  );
}