import { useState } from "react";
import { Menu, Sun, Moon, Globe, LogOut, User, Bookmark, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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

  return (
    <div className="relative flex items-center">
      <Button variant="outline" onClick={toggleMenu} aria-label="Toggle Menu">
        <Menu className="w-6 h-6" />
      </Button>
      <img 
        src="/icon.png" 
        alt="Logo" 
        className="w-8 h-8 ml-2 object-cover rounded-full" 
      />

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-card text-card-foreground shadow-lg rounded-md z-50">
          <ul className="flex flex-col py-2">
            <li>
              <button
                onClick={() => {
                  navigate("/");
                  setIsOpen(false);
                }}
                className="block px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground w-full"
              >
                {t("home")}
              </button>
            </li>
            
            {!user ? (
              <>
                <li>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setIsOpen(false);
                    }}
                    className="block px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground w-full"
                  >
                    {t("register")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsOpen(false);
                    }}
                    className="block px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground w-full"
                  >
                    {t("login")}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsOpen(false);
                    }}
                    className="block px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground w-full flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/communities");
                      setIsOpen(false);
                    }}
                    className="block px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground w-full flex items-center"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Communities
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/bookmarks");
                      setIsOpen(false);
                    }}
                    className="block px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground w-full flex items-center"
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmarks
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                      setIsOpen(false);
                    }}
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
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className="block px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground w-full flex items-center"
              >
                {theme === 'dark' ? (
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