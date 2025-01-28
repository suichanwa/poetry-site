// src/components/Communities/CommunityPost.tsx
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommunityPostProps {
  post: {
    id: number;
    title: string;
    content: string;
    images: string[];
    author: {
      id: number;
      name: string;
      avatar?: string;
    };
    createdAt: string;
    _count: {
      comments: number;
      likes: number;
    };
  };
}

export function CommunityPost({ post }: CommunityPostProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <Card className="p-4 space-y-4">
      {/* Author info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
          {post.author.avatar ? (
            <img 
              src={`http://localhost:3001${post.author.avatar}`}
              alt={post.author.name}
              crossorigin="anonymous"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              {post.author.name[0]}
            </div>
          )}
        </div>
        <div>
          <p className="font-medium">{post.author.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Post content */}
      <div>
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        <p className="text-muted-foreground">{post.content}</p>
      </div>

      {/* Images */}
      {post.images.length > 0 && (
        <div className="relative">
          <img
            src={`http://localhost:3001${post.images[currentImageIndex]}`}
            alt={`Post image ${currentImageIndex + 1}`}
            crossorigin="anonymous"
            className="w-full max-h-96 object-cover rounded-md"
          />
          {post.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {post.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-primary' : 'bg-primary/50'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="sm" className="gap-2">
          <Heart className="w-4 h-4" />
          {post._count.likes}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageCircle className="w-4 h-4" />
          {post._count.comments}
        </Button>
        <Button variant="ghost" size="sm">
          <Share className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}