import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function LikeButton() {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <button
      onClick={toggleLike}
      className={cn(
        "flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors",
        { "text-red-500 animate-ping-once": liked }
      )}
    >
      <Heart className="w-6 h-6" />
    </button>
  );
}