import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Users,
  MessageSquare,
  Plus,
  BookOpen,
  BookText,
  Book,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useModals } from "@/hooks/useModals";
import { AddPoetryModal } from "@/components/AddPoetryModal";
import { AddMangaModal } from "@/components/AddMangaModal";
import { AddLightNovelModal } from "@/components/lightnovel/AddLightNovelModal";
import { AddBookModal } from "@/components/AddBookModal";

export function MobileNavBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const {
    isPoemModalOpen,
    setIsPoemModalOpen,
    isMangaModalOpen,
    setIsMangaModalOpen,
    isLightNovelModalOpen,
    setIsLightNovelModalOpen,
    isBookModalOpen,
    setIsBookModalOpen,
  } = useModals();

  const plusButtonRef = useRef<HTMLButtonElement>(null);

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

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const response = await fetch("http://localhost:3001/api/notifications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (data.notifications) {
          setUnreadCount(
            data.notifications.filter((n: any) => !n.isRead).length
          );
        } else {
          console.error("No notifications found in response");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
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
      path: "/",
    },
    {
      icon: Users,
      path: "/communities",
    },
    {
      modal: "add",
      icon: Plus,
      ref: plusButtonRef,
    },
    {
      icon: MessageSquare,
      path: "/chats",
    },
    {
      icon: User,
      path: user ? `/profile/${user.id}` : "/login",
    },
  ];

  const addItems = [
    {
      icon: Plus,
      label: "Add Poem",
      modal: "poem",
    },
    {
      icon: BookOpen,
      label: "Add Manga",
      modal: "manga",
    },
    {
      icon: BookText,
      label: "Add Light Novel",
      modal: "lightNovel",
    },
    {
      icon: Book,
      label: "Add Book",
      modal: "book",
    },
  ];

  const handleModalOpen = (modal: string) => {
    switch (modal) {
      case "poem":
        setIsPoemModalOpen(true);
        break;
      case "manga":
        setIsMangaModalOpen(true);
        break;
      case "lightNovel":
        setIsLightNovelModalOpen(true);
        break;
      case "book":
        setIsBookModalOpen(true);
        break;
    }
    setActiveModal(null);
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{
        y: isVisible ? 0 : 100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background/80 backdrop-blur-md border-t",
        "md:hidden",
        "safe-area-bottom"
      )}
    >
      <nav className="flex items-center justify-around px-2 py-1.5 relative">
        {navItems.map(({ icon: Icon, path, modal, ref }) => (
          <Button
            key={path || modal}
            variant="ghost"
            size="icon"
            className={cn(
              "relative w-10 h-10 rounded-full",
              "hover:bg-accent/50 hover:text-accent-foreground",
              "active:scale-95 transition-all duration-200",
              path && isActive(path) && "text-primary bg-primary/10",
              modal && "bg-primary hover:bg-primary/80 text-white"
            )}
            onClick={() => {
              if (modal) {
                setActiveModal(activeModal === modal ? null : modal);
              } else {
                navigate(path);
                setActiveModal(null);
              }
            }}
            ref={ref as any}
          >
            <Icon className="w-6 h-6" />
          </Button>
        ))}
        {/* Add Modal Options */}
        <AnimatePresence>
          {activeModal === "add" && (
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 15, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-[calc(100%+0.5rem)] left-1/2 transform -translate-x-1/2 w-auto p-1 rounded-lg shadow-lg border bg-background backdrop-blur-md"
            >
              <div className="flex flex-col space-y-1">
                {addItems.map(({ icon: Icon, label, modal }) => (
                  <motion.button
                    key={modal}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleModalOpen(modal)}
                    className="flex items-center justify-start w-40 px-3 py-2 rounded-lg hover:bg-accent/80"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Modals */}
      <AddPoetryModal
        isOpen={isPoemModalOpen}
        onClose={() => setIsPoemModalOpen(false)}
        onAddPoetry={() => {}}
      />
      <AddMangaModal
        isOpen={isMangaModalOpen}
        onClose={() => setIsMangaModalOpen(false)}
        onAddManga={() => {}}
      />
      <AddLightNovelModal
        isOpen={isLightNovelModalOpen}
        onClose={() => setIsLightNovelModalOpen(false)}
        onAddLightNovel={() => {}}
      />
      <AddBookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onAddBook={() => {}}
      />
    </motion.div>
  );
}