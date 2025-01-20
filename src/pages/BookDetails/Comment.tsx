import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface CommentProps {
  comment: {
    id: number;
    content: string;
    user: {
      id: number;
      name: string;
      avatar?: string;
    };
    createdAt: string;
    likes: number;
  };
  likedComments: Record<number, boolean>;
  likeCounts: Record<number, number>;
  handleLikeComment: (commentId: number) => void;
}

export function Comment({ comment, likedComments, likeCounts, handleLikeComment }: CommentProps) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4">
      <Avatar className="w-10 h-10 cursor-pointer" onClick={() => navigate(`/profile/${comment.user.id}`)}>
        {comment.user.avatar ? (
          <AvatarImage src={`http://localhost:3001${comment.user.avatar}`} />
        ) : (
          <AvatarFallback>
            <User className="w-5 h-5" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span 
            className="font-medium hover:underline cursor-pointer"
            onClick={() => navigate(`/profile/${comment.user.id}`)}
          >
            {comment.user.name}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-foreground/90">{comment.content}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleLikeComment(comment.id)}
          className={`mt-1 p-0 h-auto hover:bg-transparent ${likedComments[comment.id] ? 'text-red-500' : 'text-muted-foreground'}`}
        >
          <Heart 
            className="w-4 h-4 mr-1" 
            fill={likedComments[comment.id] ? "currentColor" : "none"} 
          />
          <span className="text-xs">{likeCounts[comment.id] || 0}</span>
        </Button>
      </div>
    </div>
  );
}