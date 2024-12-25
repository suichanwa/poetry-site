import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Share2, ArrowLeft } from "lucide-react";
import { PoemActions } from "@/components/subcomponents/PoemActions";

interface Poem {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  comments: Array<{
    id: number;
    content: string;
    user: {
      name: string;
      avatar?: string;
    };
  }>;
}

export default function PoemDetail() {
  const { id } = useParams<{ id: string }>();
  const [poem, setPoem] = useState<Poem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoemDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/poems/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch poem');
        }
        const data = await response.json();
        setPoem(data);
      } catch (error) {
        console.error('Error fetching poem:', error);
        setError('Failed to load poem');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBookmarkStatus = async () => {
      if (!user) return;
      try {
        const response = await fetch(`http://localhost:3000/api/poems/${id}/bookmark/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setIsBookmarked(data.bookmarked);
      } catch (error) {
        console.error('Error fetching bookmark status:', error);
      }
    };

    fetchPoemDetails();
    fetchBookmarkStatus();
  }, [id, user]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: poem?.title || '',
          text: poem?.content || '',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/poems/${id}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to bookmark poem');
      }

      const data = await response.json();
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      console.error('Error bookmarking poem:', error);
    }
  };

  const addComment = async (comment: string) => {
    // Implement comment functionality
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <Card className="max-w-2xl mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !poem) {
    return (
      <div className="min-h-screen p-6">
        <Card className="max-w-2xl mx-auto p-6 text-center">
          <p className="text-red-500">{error || 'Poem not found'}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-4">{poem.title}</h1>
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            {poem.author.avatar && (
              <img
                src={`http://localhost:3000${poem.author.avatar}`}
                alt={poem.author.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <p className="font-medium">{poem.author.name}</p>
            <p className="text-sm text-gray-500">
              {new Date(poem.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-6">
          <p className="whitespace-pre-wrap">{poem.content}</p>
        </div>

        <PoemActions
          onAddComment={addComment}
          onShare={handleShare}
          onBookmark={handleBookmark}
          isBookmarked={isBookmarked}
        />

        {poem.comments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            <div className="space-y-4">
              {poem.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {comment.user.avatar && (
                      <img
                        src={`http://localhost:3000${comment.user.avatar}`}
                        alt={comment.user.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{comment.user.name}</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}