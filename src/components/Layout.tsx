import { ReactNode } from 'react';
import { MobileNavBar } from './navigation/MobileNavBar';
import BurgerMenu from './BurgerMenu';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="hidden md:flex"> {/* Changed from sm:flex to md:flex */}
            <BurgerMenu />
          </div>

          {user && (
            <div className="flex items-center gap-2 ml-auto">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 hover:bg-accent"
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={`http://localhost:3000${user.avatar}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <span className="font-medium hidden md:inline-block">
                  {user.name}
                </span>
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="pb-20 md:pb-0"> {/* Increased bottom padding for mobile */}
        {children}
      </main>
      <MobileNavBar />
    </div>
  );
}