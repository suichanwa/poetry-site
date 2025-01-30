import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    avatar?: string;
  };
  _count: {
    comments: number;
  };
}

interface CommunityPostCardProps {
  post: Post;
}

export function CommunityPostCard({ post }: CommunityPostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          <Link href={`/posts/${post.id}`} passHref>
            <span className="hover:underline cursor-pointer">{post.title}</span>
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Posted by {post.author.name}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            {formatDate(post.createdAt)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`transition-all duration-300 overflow-hidden ${
            isExpanded ? 'max-h-full' : 'max-h-40'
          }`}
        >
          {post.content}
        </div>
        {post.content.length > 200 && (
          <Button variant="link" size="sm" onClick={toggleExpand} className="mt-2">
            {isExpanded ? 'Read Less' : 'Read More'}
          </Button>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {post._count.comments} Comments
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}