import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SideMenu } from "@/components/SideMenu";
import { MobileNavBar } from "@/components/navigation/MobileNavBar";
import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getImageUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path}`;
  };

  return (
    <div className="theme-winter">
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <div className="hidden md:flex">
              <SideMenu />
            </div>

            {user && (
              <div className="flex items-center gap-2 ml-auto">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 hover:bg-accent"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  <Avatar className="h-8 w-8">
                    {user.avatar ? (
                      <AvatarImage
                        src={getImageUrl(user.avatar)}
                        alt={user.name}
                      />
                    ) : (
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="hidden sm:inline font-medium">
                    {user.name}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </header>

        <main>{children}</main>
        <MobileNavBar />
      </div>
    </div>
  );
}