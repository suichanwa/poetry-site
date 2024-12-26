import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";
import { PoemActions } from "@/components/subcomponents/PoemActions";
import { PoemDetailHeader } from "@/components/subcomponents/PoemDetailHeader";
import { PoemDetailComments } from "@/components/subcomponents/PoemDetailComments";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";

interface Poem {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  comments: Array<{
    id: number;
    content: string;
    user: {
      id: number;
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

const addComment = async (comment: string) => {
  if (!user || !poem) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/poems/${id}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: comment }),
    });

    if (!response.ok) {
      throw new Error('Failed to add comment');
    }

    const newComment = await response.json();
    setPoem(prev => {
      if (!prev) return null;
      return {
        ...prev,
        comments: [newComment, ...prev.comments]
      };
    });
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [poemResponse, bookmarkResponse] = await Promise.all([
          fetch(`http://localhost:3000/api/poems/${id}`),
          user ? fetch(`http://localhost:3000/api/poems/${id}/bookmark/status`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }) : null
        ]);

        if (!poemResponse.ok) {
          throw new Error('Failed to fetch poem');
        }

        const poemData = await poemResponse.json();
        setPoem(poemData);

        if (bookmarkResponse) {
          const bookmarkData = await bookmarkResponse.json();
          setIsBookmarked(bookmarkData.bookmarked);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load poem');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleShare = async () => {
    if (!poem) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: poem.title,
          text: poem.content,
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

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !poem) {
    return <ErrorState error={error} onBack={() => navigate(-1)} />;
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
        
        <PoemDetailHeader 
          author={poem.author} 
          createdAt={poem.createdAt} 
        />

        <div className="prose dark:prose-invert max-w-none mb-6">
          <p className="whitespace-pre-wrap">{poem.content}</p>
        </div>

        <PoemActions
          onAddComment={addComment}
          onShare={handleShare}
          onBookmark={handleBookmark}
          isBookmarked={isBookmarked}
        />

        <PoemDetailComments 
          comments={poem.comments}
          onUserClick={(userId) => navigate(`/profile/${userId}`)}
        />
      </Card>
    </div>
  );
}