import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
}

export function Comment({ comment }: CommentProps) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);

  // Function to handle liking/unliking a comment
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    // Here you would typically also send a request to your backend to update the like status
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Avatar
          className="w-8 h-8 cursor-pointer"
          onClick={() => navigate(`/profile/${comment.user.id}`)}
        >
          {comment.user.avatar ? (
            <AvatarImage
              src={`http://localhost:3001${comment.user.avatar}`}
              alt={comment.user.name}
            />
          ) : (
            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <CardTitle
            className="text-base font-medium hover:underline cursor-pointer"
            onClick={() => navigate(`/profile/${comment.user.id}`)}
          >
            {comment.user.name}
          </CardTitle>
          <CardDescription className="text-xs">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/90">{comment.content}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`p-0 h-auto hover:bg-transparent ${
                  isLiked ? "text-red-500" : "text-muted-foreground"
                }`}
              >
                <Heart
                  className="w-4 h-4 mr-1"
                  fill={isLiked ? "currentColor" : "none"}
                />
                <span className="text-xs">{likeCount}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isLiked ? "Unlike" : "Like"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}