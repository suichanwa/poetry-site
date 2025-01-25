import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Heart, Eye, Clock, User, Share2, Plus, Trash2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/LoadingState";
import { LightNovelReaderWrapper } from "@/components/lightnovel/LightNovelReaderWrapper";
import { AddChapterModalWrapper } from "@/components/lightnovel/AddChapterModalWrapper";
import { Rating } from "@/components/ui/Rating";

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
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

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

        const ratingsResponse = await fetch(`http://localhost:3001/api/rating/lightnovel/${id}/ratings`, {
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        if (!ratingsResponse.ok) throw new Error('Failed to fetch ratings');
        const ratingsData = await ratingsResponse.json();
        setAverageRating(ratingsData.average);
        setTotalRatings(ratingsData.total);
        setRating(ratingsData.userRating || 0);
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

  const handleRate = async (newRating: number) => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/rating/lightnovel/${id}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ rating: newRating }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to rate light novel");
      }

      const data = await response.json();
      setRating(newRating);
      await fetchUpdatedRatings();
    } catch (error) {
      console.error("Error rating light novel:", error);
      setError(
        error instanceof Error ? error.message : "Failed to rate light novel"
      );
    }
  };

  const fetchUpdatedRatings = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3001/api/rating/lightnovel/${id}/ratings`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
    const data = await response.json();
    setAverageRating(data.average);
    setTotalRatings(data.total);
  };

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
      const response = await fetch(`http://localhost:3001/api/lightnovels/${novel.id}/like`, {
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
      const response = await fetch(`http://localhost:3001/api/lightnovels/${novel.id}`, {
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

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;
    const cleanPath = path.replace(/^.*[\/\\]uploads[\/\\]/, "uploads/").replace(/\\/g, "/");
    return `http://localhost:3001/${cleanPath}`;
  };

  if (isLoading) return <LoadingState />;
  if (error || !novel) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="shadow-lg">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="aspect-[3/4] w-full md:w-64 relative">
                <img
                  src={getImageUrl(novel.coverImage)}
                  alt={novel.title}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    console.error('Error loading image:', novel.coverImage);
                    e.currentTarget.src = '/placeholder.png';
                  }}
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold">{novel.title}</h1>
                <p className="text-muted-foreground mt-2">{novel.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    {novel.author.avatar ? (
                      <AvatarImage src={getImageUrl(novel.author.avatar)} />
                    ) : (
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-muted-foreground font-medium">{novel.author.name}</span>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={handleLike} className={isLiked ? "text-red-500" : ""}>
                    <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                    {novel.likes}
                  </Button>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">{novel.views}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {formatDistanceToNow(new Date(novel.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.share({ title: novel.title, text: novel.description, url: window.location.href })}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  {user?.id === novel.author.id && (
                    <Button variant="destructive" size="sm" onClick={handleDeleteNovel}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {novel.tags.map(tag => (
                    <span key={tag.name} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                      {tag.name}
                    </span>
                  ))}
                </div>
                <div className="mt-4">
                  <Rating initialRating={rating} onRate={handleRate} />
                  <p>Average Rating: {averageRating} ({totalRatings} ratings)</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Chapters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {isReaderOpen && currentChapter && (
          <LightNovelReaderWrapper
            currentChapter={currentChapter}
            handleChapterChange={handleChapterChange}
            setIsReaderOpen={setIsReaderOpen}
            totalChapters={novel.chapters.length}
          />
        )}

        <AddChapterModalWrapper
          isAddChapterOpen={isAddChapterOpen}
          setIsAddChapterOpen={setIsAddChapterOpen}
          novelId={novel.id}
          setNovel={setNovel}
          currentChaptersCount={novel.chapters.length}
        />
      </div>
    </div>
  );
}