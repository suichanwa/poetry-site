// src/components/CommunityCard.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, CalendarDays } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CommunityCardProps {
  id: number;
  name: string;
  description: string;
  avatar?: string;
  banner?: string;
  createdAt: string;
  _count: {
    members: number;
    posts: number;
  };
  isPreview?: boolean;
}

export function CommunityCard({
  id,
  name,
  description,
  avatar,
  createdAt,
  _count,
  isPreview = true
}: CommunityCardProps) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (isPreview) {
      navigate(`/communities/${id}`);
    }
  };

  return (
    <Card 
      className="transform transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800 p-4 animate-fadeIn"
      onClick={handleNavigate}
    >
      {/* Community Header */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
          {avatar ? (
            <img 
              src={`http://localhost:3000${avatar}`}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Users className="w-6 h-6 text-primary" />
          )}
        </div>

        {/* Community Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {description}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{_count.members} members</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarDays className="w-4 h-4" />
          <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      {/* Post Count */}
      <div className="mt-2 text-sm text-muted-foreground">
        {_count.posts} posts
      </div>
    </Card>
  );
}