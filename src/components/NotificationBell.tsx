import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { NotificationList } from './NotificationList';
import { Badge } from '@/components/ui/badge';

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const response = await fetch('http://localhost:3001/api/notifications', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter(n => !n.isRead).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <NotificationList 
          notifications={notifications}
          onClose={() => setIsOpen(false)}
          onMarkAsRead={(id) => {
            setNotifications(notifications.map(n => 
              n.id === id ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
          }}
          onMarkAllAsRead={() => {
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
          }}
        />
      )}
    </div>
  );
}