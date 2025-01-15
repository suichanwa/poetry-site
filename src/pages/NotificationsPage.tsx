import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { NotificationSettings } from '@/components/NotificationSettings';
import { Bell, Settings, Loader2 } from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  sender?: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");
      
      const response = await fetch('http://localhost:3001/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error instanceof Error ? error.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Set up polling for new notifications
    const pollInterval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, [user]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/notifications/${notificationId}/mark-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Please log in to view notifications</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          {notifications.some(n => !n.isRead) && (
            <Button onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showSettings ? (
        <NotificationSettings />
      ) : (
        <Card className="p-4">
          <ScrollArea className="h-[600px] pr-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`p-4 transition-colors hover:bg-accent cursor-pointer ${
                      notification.isRead ? 'bg-muted/50' : 'bg-primary/5'
                    }`}
                    onClick={() => {
                      handleMarkAsRead(notification.id);
                      if (notification.link) {
                        window.location.href = notification.link;
                      }
                    }}
                  >
                    <div className="flex gap-4">
                      {notification.sender?.avatar && (
                        <img
                          src={`http://localhost:3001${notification.sender.avatar}`}
                          alt={notification.sender.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{notification.content}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No notifications yet
              </p>
            )}
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}