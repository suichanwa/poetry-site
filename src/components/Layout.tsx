import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import BurgerMenu from "@/components/BurgerMenu";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user } = useAuth();

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

export default Layout;