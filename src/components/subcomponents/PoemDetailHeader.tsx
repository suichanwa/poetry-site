import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PoemDetailHeaderProps {
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export function PoemDetailHeader({ author, createdAt }: PoemDetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(`/profile/${author.id}`)}
      className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
    >
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {author.avatar ? (
          <img
            src={`http://localhost:3001${author.avatar}`}
            alt={author.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-6 h-6 m-2 text-gray-500 dark:text-gray-400" />
        )}
      </div>
      <div className="text-left">
        <p className="font-medium hover:underline">{author.name}</p>
        <p className="text-sm text-gray-500">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
    </button>
  );
}