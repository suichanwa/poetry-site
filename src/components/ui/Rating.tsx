import React, { useState } from "react";
import { Star } from "lucide-react";

interface RatingProps {
  initialRating: number;
  onRate: (rating: number) => void;
  readOnly?: boolean;
}

export const Rating: React.FC<RatingProps> = ({ initialRating, onRate, readOnly = false }) => {
  const [rating, setRating] = useState(initialRating);

  const handleRate = (rate: number) => {
    if (readOnly) return;
    setRating(rate);
    onRate(rate);
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
          onClick={() => handleRate(star)}
        />
      ))}
    </div>
  );
};