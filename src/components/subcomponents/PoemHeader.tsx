// src/components/subcomponents/PoemHeader.tsx
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PoemHeaderProps {
  title: string;
  author: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  label?: string;
  isPreview?: boolean;
}

export function PoemHeader({ title, author, label, isPreview = true }: PoemHeaderProps) {
  const navigate = useNavigate();
  const maxTitleLength = window.innerWidth < 640 ? 60 : 120;
  const displayTitle = isPreview && title.length > maxTitleLength 
    ? `${title.slice(0, maxTitleLength)}...` 
    : title;

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${author.id}`);
  };

  return (
    <>
      {label && (
        <div className="text-sm font-semibold text-blue-500 mb-2 animate-fadeIn">
          {label}
        </div>
      )}
      <div className="border-b pb-2">
        <button 
          className="flex items-center gap-2 mb-2 hover:opacity-80 transition-opacity"
          onClick={handleAuthorClick}
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
            {author.avatar ? (
              <img
                src={`http://localhost:3000${author.avatar}`}
                alt={author.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold hover:text-primary transition-colors line-clamp-2 text-left break-words">
              {displayTitle}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-left break-words">
              By {author.name}
            </p>
          </div>
        </button>
      </div>
    </>
  );
}