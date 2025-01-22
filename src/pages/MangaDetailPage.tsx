// src/pages/MangaDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MangaReaderWrapper } from "@/components/manga/MangaReaderWrapper";
import { LoadingState } from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Heart,
  Eye,
  Clock,
  User,
  Share2,
  Plus,
  Trash2,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { AddChapterModalWrapper } from "@/components/manga/AddChapterModalWrapper";
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
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="aspect-[3/4] w-full md:w-64 relative">
                <img
                  src={getImageUrl(manga.coverImage)}
                  alt={manga.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl md:text-3xl font-bold">{manga.title}</CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  {manga.description}
                </CardDescription>
                <div className="mt-4 flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    {manga.author.avatar ? (
                      <AvatarImage src={getImageUrl(manga.author.avatar)} />
                    ) : (
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-muted-foreground font-medium">{manga.author.name}</span>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={handleLike} className={isLiked ? "text-red-500" : ""}>
                    <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                    {manga.likes}
                  </Button>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">{manga.views}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {formatDistanceToNow(new Date(manga.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.share({ title: manga.title, text: manga.description, url: window.location.href })}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  {user?.id === manga.author.id && (
                    <Button variant="destructive" size="sm" onClick={handleDeleteManga}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {manga.tags.map(tag => (
                    <Badge key={tag.name} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <Separator className="my-4" />
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Chapters</h2>
              {user?.id === manga.author.id && (
                <Button onClick={() => setIsAddChapterOpen(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Chapter
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {manga.chapters.map((chapter, index) => (
                <Button
                    key={chapter.id}
                    variant={currentChapter?.id === chapter.id ? "default" : "outline"}
                    className="w-full flex items-center justify-between"
                    onClick={() => {
                      handleReadChapter(chapter);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="truncate">
                        Chapter {chapter.orderIndex}: {chapter.title}
                      </span>
                    </div>
                    {index === 0 && <Badge variant="secondary" className="ml-2">New</Badge>}
                    {currentChapter?.id === chapter.id && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering parent button click
                              const previousChapter = manga.chapters.find(c => c.orderIndex === chapter.orderIndex - 1);
                              if (previousChapter) {
                                handleChapterChange(previousChapter.id);
                              }
                            }}
                            disabled={chapter.orderIndex === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextChapter = manga.chapters.find(c => c.orderIndex === chapter.orderIndex + 1);
                              if (nextChapter) {
                                handleChapterChange(nextChapter.id);
                              }
                            }}
                            disabled={chapter.orderIndex === manga.chapters.length}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                    )}
                  </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {isReaderOpen && currentChapter && (
          <MangaReaderWrapper
            currentChapter={currentChapter}
            handleChapterChange={handleChapterChange}
            setIsReaderOpen={setIsReaderOpen}
            totalChapters={manga.chapters.length}
          />
        )}

        <AddChapterModalWrapper
          isAddChapterOpen={isAddChapterOpen}
          setIsAddChapterOpen={setIsAddChapterOpen}
          mangaId={manga.id}
          setManga={setManga}
          currentChaptersCount={manga.chapters.length}
        />
      </div>
      {/* Potential area for "Recommended Manga" section */}
    </div>
  );
}