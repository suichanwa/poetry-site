import { useState } from "react";
import { Menu, Sun, Moon, Globe, LogOut, User, Bookmark } from "lucide-react";
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

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    console.log(`Language changed to ${lang}`);
  };

  return (
    <div className="relative">
      <Button variant="outline" onClick={toggleMenu} aria-label="Toggle Menu">
        <Menu className="w-6 h-6" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50">
          <ul className="flex flex-col">
            <li>
              <button
                onClick={() => {
                  navigate("/");
                  setIsOpen(false);
                }}
                className="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
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
                    className="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
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
                    className="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
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
                    className="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 w-full flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/bookmarks");
                      setIsOpen(false);
                    }}
                    className="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 w-full flex items-center"
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
                    className="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 w-full flex items-center text-red-500"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* Theme and Language options remain the same */}
          </ul>
        </div>
      )}
    </div>
  );
}