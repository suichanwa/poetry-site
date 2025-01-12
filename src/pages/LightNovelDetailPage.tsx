// src/pages/LightNovelDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Heart, Eye, Clock, User, Share2, Plus, Trash2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/LoadingState";
import { LightNovelReader } from "@/components/lightnovel/LightNovelReader";
import { AddChapterModal } from "@/components/lightnovel/AddChapterModal";

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

export default function LightNovelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [novel, setNovel] = useState<LightNovelDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false);

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^.*[\/\\]uploads[\/\\]/, 'uploads/').replace(/\\/g, '/');
    return `http://localhost:3000/${cleanPath}`;
  };

  useEffect(() => {
    const fetchNovelDetail = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/lightnovels/${id}`, {
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        if (!response.ok) throw new Error('Failed to fetch light novel');
        const data = await response.json();
        setNovel(data);
        setIsLiked(data.isLiked || false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchNovelDetail();
    }
  }, [id]);

  const handleReadChapter = (chapter: Chapter) => {
    setCurrentChapter(chapter);
    setIsReaderOpen(true);
  };

  const handleChapterChange = (chapterId: number) => {
    const chapter = novel?.chapters.find(c => c.id === chapterId);
    if (chapter) {
      setCurrentChapter(chapter);
    }
  };

  const handleLike = async () => {
    if (!user || !novel) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/lightnovels/${novel.id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to like light novel');

      setIsLiked(!isLiked);
      setNovel(prev => prev ? { ...prev, likes: isLiked ? prev.likes - 1 : prev.likes + 1 } : prev);
    } catch (error) {
      console.error('Error liking light novel:', error);
    }
  };

  const handleDeleteNovel = async () => {
    if (!user || !novel) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this light novel?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/lightnovels/${novel.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete light novel');

      navigate('/lightnovels');
    } catch (error) {
      console.error('Error deleting light novel:', error);
      setError('Failed to delete light novel');
    }
  };

  if (isLoading) return <LoadingState />;
  if (error || !novel) return <div className="text-center text-red-500">{error}</div>;

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
              src={getImageUrl(novel.coverImage)}
              alt={novel.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Novel Info */}
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-3xl font-bold">{novel.title}</h1>
            
            {/* Author Info */}
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                {novel.author.avatar ? (
                  <AvatarImage src={getImageUrl(novel.author.avatar)} />
                ) : (
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-muted-foreground">{novel.author.name}</span>
            </div>

            <p className="text-muted-foreground">{novel.description}</p>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLike}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                {novel.likes}
              </Button>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {novel.views}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {formatDistanceToNow(new Date(novel.createdAt), { addSuffix: true })}
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigator.share({ title: novel.title, text: novel.description, url: window.location.href })}>
                <Share2 className="w-4 h-4" />
              </Button>
              {user?.id === novel.author.id && (
                <Button variant="destructive" size="sm" onClick={handleDeleteNovel}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Novel
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {novel.tags.map(tag => (
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
                {user?.id === novel.author.id && (
                  <Button onClick={() => setIsAddChapterOpen(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Chapter
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {novel.chapters.map(chapter => (
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
        <LightNovelReader
          chapter={currentChapter}
          onChapterChange={handleChapterChange}
          onClose={() => setIsReaderOpen(false)}
          totalChapters={novel.chapters.length}
        />
      )}

      <AddChapterModal
        isOpen={isAddChapterOpen}
        onClose={() => setIsAddChapterOpen(false)}
        novelId={novel.id}
        onChapterAdded={(newChapter) => setNovel(prev => prev ? { ...prev, chapters: [...prev.chapters, newChapter] } : prev)}
        currentChaptersCount={novel.chapters.length}
      />
    </div>
  );
}