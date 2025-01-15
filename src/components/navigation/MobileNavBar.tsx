import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Users, MessageSquare, Bell, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export function MobileNavBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
        setUnreadCount(data.notifications.filter((n: any) => !n.isRead).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { 
      icon: Home,
      path: '/' 
    },
    { 
      icon: User,
      path: user ? `/profile/${user.id}` : '/login' 
    },
    { 
      icon: Users,
      path: '/communities' 
    },
    { 
      icon: MessageSquare,
      path: '/chats'  // Updated to use chats instead of messages
    },
    { 
      icon: Bell,
      path: '/notifications',
      badge: unreadCount > 0 ? unreadCount : null
    },
    { 
      icon: Bookmark,
      path: '/bookmarks' 
    }
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ 
        y: isVisible ? 0 : 100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ 
        duration: 0.2,
        ease: "easeInOut"
      }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background/80 backdrop-blur-md border-t",
        "md:hidden", 
        "safe-area-bottom" 
      )}
    >
      <nav className="flex items-center justify-around px-2 py-1.5">
        {navItems.map(({ icon: Icon, path, badge }) => (
          <Button
            key={path}
            variant="ghost"
            size="icon"
            className={cn(
              "relative w-10 h-10 rounded-full",
              "hover:bg-accent/50 hover:text-accent-foreground",
              "active:scale-95 transition-all duration-200",
              isActive(path) && "text-primary bg-primary/10"
            )}
            onClick={() => navigate(path)}
          >
            <Icon className="w-4 h-4" />
            {badge && (
              <Badge 
                variant="destructive"
                className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 text-[10px] flex items-center justify-center p-0"
              >
                {badge}
              </Badge>
            )}
          </Button>
        ))}
      </nav>
    </motion.div>
  );
}