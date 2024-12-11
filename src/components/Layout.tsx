import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BurgerMenu from "@/components/BurgerMenu";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Debug logs
  console.log('Current user in Layout:', user);
  console.log('Avatar path:', user?.avatar);
  console.log('Full avatar URL:', user?.avatar ? `http://localhost:3000${user.avatar}` : 'No avatar');

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <header className="flex justify-between items-center p-4 bg-card text-card-foreground shadow-md">
        <BurgerMenu />
        {user ? (
          <Button
            variant="ghost"
            className="flex items-center space-x-2"
            onClick={() => navigate("/profile")}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img 
                  src={`http://localhost:3000${user.avatar}`}
                  alt={user.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Error loading avatar:', e);
                    e.currentTarget.src = '';
                  }}
                />
              ) : (
                <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              )}
            </div>
            <span className="font-medium">{user.name}</span>
          </Button>
        ) : (
          <div className="space-x-2">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        )}
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}