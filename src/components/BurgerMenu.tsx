import { useState } from "react";
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
  Bell,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false); // Close the menu after navigation
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false); // Close the menu after logout
  };

  const handleThemeToggle = () => {
    toggleTheme();
    setIsOpen(false); // Close the menu after toggling the theme
  };

  return (
    <div className="relative flex items-center">
      <Button variant="outline" onClick={toggleMenu} aria-label="Toggle Menu">
        <Menu className="w-6 h-6" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-card text-card-foreground shadow-lg rounded-md z-50">
          <ul className="flex flex-col py-2">
            <li>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground w-full"
              >
                {t("home")}
              </Link>
            </li>

            {!user ? (
              <>
                <li>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground w-full"
                  >
                    {t("register")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground w-full"
                  >
                    {t("login")}
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground w-full flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/communities"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground w-full flex items-center"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Communities
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bookmarks"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground w-full flex items-center"
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmarks
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground w-full flex items-center text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* Theme Toggle */}
            <li className="border-t border-border mt-2 pt-2">
              <button
                onClick={handleThemeToggle}
                className="block px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground w-full flex items-center"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4 mr-2" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2" />
                    Dark Mode
                  </>
                )}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}