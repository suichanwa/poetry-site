// src/components/Communities/ThreadList.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ThreadListProps {
  threads: {
    id: number;
    title: string;
    content: string;
    author: {
      id: number;
      name: string;
      avatar?: string;
    };
    createdAt: string;
    _count: {
      comments: number;
    };
  }[];
}

export function ThreadList({ threads }: ThreadListProps) {
  return (
    <div className="space-y-4">
      {threads.map(thread => (
        <Card key={thread.id} className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
              {thread.author.avatar ? (
                <img 
                  src={`http://localhost:3001${thread.author.avatar}`}
                  alt={thread.author.name}
                  crossorigin="anonymous"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  {thread.author.name[0]}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{thread.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">{thread.title}</h3>
            <p className="text-muted-foreground">{thread.content}</p>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              {thread._count.comments}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}