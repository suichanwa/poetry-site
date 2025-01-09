import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Heart, Eye, Clock, User, Share2, Plus } from "lucide-react";
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

  const handleShare = async () => {
    try {
      await navigator.share({
        title: novel?.title,
        text: novel?.description,
        url: window.location.href
      });
    } catch (error) {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleChapterAdded = (newChapter: Chapter) => {
    setNovel(prev => {
      if (!prev) return null;
      return {
        ...prev,
        chapters: [...prev.chapters, newChapter].sort((a, b) => a.orderIndex - b.orderIndex)
      };
    });
  };

  if (isLoading) return <LoadingState />;
  if (error || !novel) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen p-6 bg-background">
      <Card className="max-w-4xl mx-auto p-6 shadow-lg">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cover Image */}
          <div className="aspect-[3/4] relative group">
            <img
              src={getImageUrl(novel.coverImage)}
              alt={novel.title}
              className="w-full h-full object-cover rounded-lg shadow-md transition-transform group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Novel Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4 leading-tight">{novel.title}</h1>
              
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-10 h-10 border-2 border-primary">
                  {novel.author.avatar ? (
                    <AvatarImage src={getImageUrl(novel.author.avatar)} />
                  ) : (
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <span className="font-medium">{novel.author.name}</span>
                  <p className="text-sm text-muted-foreground">Author</p>
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">{novel.description}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 py-4 border-y">
              <Button variant="ghost" size="sm" onClick={handleShare} className="hover:bg-secondary">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span>{novel.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{formatDistanceToNow(new Date(novel.createdAt), { addSuffix: true })}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {novel.tags.map(tag => (
                <span
                  key={tag.name}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors cursor-default"
                >
                  {tag.name}
                </span>
              ))}
            </div>

            {/* Chapters */}
            <div className="pt-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Chapters</h2>
                {user?.id === novel.author.id && (
                  <Button onClick={() => setIsAddChapterOpen(true)} size="sm" className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Chapter
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {novel.chapters.map(chapter => (
                  <Button
                    key={chapter.id}
                    variant="outline"
                    className="justify-start h-auto py-3 hover:bg-secondary/50"
                    onClick={() => handleReadChapter(chapter)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Chapter {chapter.orderIndex}</span>
                      <span className="text-sm text-muted-foreground truncate">
                        {chapter.title}
                      </span>
                    </div>
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
        onChapterAdded={handleChapterAdded}
        currentChaptersCount={novel.chapters.length}
      />
    </div>
  );
}