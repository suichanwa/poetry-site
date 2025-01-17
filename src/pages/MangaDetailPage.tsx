// src/pages/MangaDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MangaReader } from "@/components/MangaReader";
import { LoadingState } from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Heart, Eye, Clock, User, Share2, Plus, Trash2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from "@/context/AuthContext";
import { AddChapterModal } from "@/components/AddChapterModal";
import { MangaGrid } from "@/components/MangaGrid";

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
  const { user } = useAuth();
  const [manga, setManga] = useState<MangaDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false);
  const [recommendedMangas, setRecommendedMangas] = useState<MangaDetail[]>([]);
  const [recommendedError, setRecommendedError] = useState<string>("");

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^.*[\/\\]uploads[\/\\]/, 'uploads/').replace(/\\/g, '/');
    return `http://localhost:3001/${cleanPath}`;
  };

  useEffect(() => {
    const fetchMangaDetail = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/manga/${id}`, {
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        if (!response.ok) throw new Error('Failed to fetch manga');
        const data = await response.json();
        setManga(data);
        setIsLiked(data.isLiked || false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        console.error('Error fetching manga:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRecommendedMangas = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/manga/recommended?excludeId=${id}`);
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch recommended mangas');
        }
        const data = await response.json();
        setRecommendedMangas(data);
      } catch (error) {
        console.error('Error fetching recommended mangas:', error);
        setRecommendedError('Failed to load recommended mangas');
      }
    };

    if (id) {
      fetchMangaDetail();
      fetchRecommendedMangas();
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

  const handleLike = async () => {
    if (!user || !manga) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/manga/${manga.id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to like manga');

      setIsLiked(!isLiked);
      setManga(prev => prev ? { ...prev, likes: isLiked ? prev.likes - 1 : prev.likes + 1 } : prev);
    } catch (error) {
      console.error('Error liking manga:', error);
    }
  };

  const handleDeleteManga = async () => {
    if (!user || !manga) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this manga?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/manga/${manga.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete manga');

      navigate('/manga');
    } catch (error) {
      console.error('Error deleting manga:', error);
      setError('Failed to delete manga');
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
              src={getImageUrl(manga.coverImage)}
              alt={manga.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Manga Info */}
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-3xl font-bold">{manga.title}</h1>
            
            {/* Author Info */}
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                {manga.author.avatar ? (
                  <AvatarImage src={getImageUrl(manga.author.avatar)} />
                ) : (
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-muted-foreground">{manga.author.name}</span>
            </div>

            <p className="text-muted-foreground">{manga.description}</p>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLike}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                {manga.likes}
              </Button>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {manga.views}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {formatDistanceToNow(new Date(manga.createdAt), { addSuffix: true })}
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigator.share({ title: manga.title, text: manga.description, url: window.location.href })}>
                <Share2 className="w-4 h-4" />
              </Button>
              {user?.id === manga.author.id && (
                <Button variant="destructive" size="sm" onClick={handleDeleteManga}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Manga
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {manga.tags.map(tag => (
                <span
                  key={tag.name}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>

            {/* Chapters */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Chapters</h2>
                {user?.id === manga.author.id && (
                  <Button onClick={() => setIsAddChapterOpen(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Chapter
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {manga.chapters.map(chapter => (
                  <Button
                    key={chapter.id}
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleReadChapter(chapter)}
                  >
                    <span className="truncate">
                      Chapter {chapter.orderIndex}: {chapter.title}
                    </span>
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

      <AddChapterModal
        isOpen={isAddChapterOpen}
        onClose={() => setIsAddChapterOpen(false)}
        mangaId={manga.id}
        onChapterAdded={(newChapter) => setManga(prev => prev ? { ...prev, chapters: [...prev.chapters, newChapter] } : prev)}
        currentChaptersCount={manga.chapters.length}
      />

      {/* Recommended Mangas */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recommended Mangas</h2>
        {recommendedError ? (
          <div className="text-red-500">{recommendedError}</div>
        ) : (
          <MangaGrid mangas={recommendedMangas} onMangaClick={(mangaId) => navigate(`/manga/${mangaId}`)} />
        )}
      </div>
    </div>
  );
}