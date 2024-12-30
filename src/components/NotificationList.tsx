import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface NotificationListProps {
  notifications: any[];
  onClose: () => void;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationList({ 
  notifications, 
  onClose, 
  onMarkAsRead, 
  onMarkAllAsRead 
}: NotificationListProps) {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-background border rounded-lg shadow-lg z-50">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.some(n => !n.isRead) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg transition-colors cursor-pointer hover:bg-accent ${
                    notification.isRead ? 'bg-muted/50' : 'bg-primary/10'
                  }`}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <p className="text-sm">{notification.content}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No notifications</p>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}