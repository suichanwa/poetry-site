import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Clock, User, Share2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from "@/context/AuthContext";

interface LightNovelInfoProps {
  novel: any;
  isLiked: boolean;
  handleLike: () => void;
  handleDeleteNovel: () => void;
}

export function LightNovelInfo({ novel, isLiked, handleLike, handleDeleteNovel }: LightNovelInfoProps) {
  const { user } = useAuth();

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^.*[\/\\]uploads[\/\\]/, 'uploads/').replace(/\\/g, '/');
    return `http://localhost:3001/${cleanPath}`;
  };

  return (
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
        {novel.tags.map((tag: any) => (
          <span
            key={tag.name}
            className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}