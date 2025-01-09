// src/components/SideMenu.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  Sun,
  Moon,
  Globe,
  LogOut,
  User,
  Bookmark,
  Users,
  Home,
  Settings,
  BookOpen,
  Library,
  Bell,
  MessageSquare
} from "lucide-react";

export function SideMenu() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <img 
              src="/icon.png" 
              alt="Logo" 
              className="w-8 h-8 object-cover rounded-full" 
            />
            Poetry Site
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col gap-4 mt-6">
          {/* Navigation Links */}
          <div className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => navigate("/")}
            >
              <Home className="mr-2 h-5 w-5" />
              {t("home")}
            </Button>

            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => navigate("/library")}
            >
              <Library className="mr-2 h-5 w-5" />
              Library
            </Button>

            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => navigate("/poems")}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Poems
            </Button>
          </div>

          {/* Auth Section */}
          <div className="space-y-3">
            {!user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/register")}
                >
                  {t("register")}
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/login")}
                >
                  {t("login")}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/profile")}
                >
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/notifications")}
                >
                  <Bell className="mr-2 h-5 w-5" />
                  Notifications
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/messages")}
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Messages
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/communities")}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Communities
                </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/chats")} // Changed from "/messages"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Chats {/* Changed from "Messages" */}
              </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/bookmarks")}
                >
                  <Bookmark className="mr-2 h-5 w-5" />
                  Bookmarks
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive" 
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Settings Section */}
          <div className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="mr-2 h-5 w-5" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-5 w-5" />
                  Dark Mode
                </>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate("/settings")}
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}