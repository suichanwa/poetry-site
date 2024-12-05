import { useState } from "react";
import { Menu, Sun, Moon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    console.log(`Language changed to ${lang}`);
  };

  return (
    <div className="relative">
      {/* Burger Button */}
      <Button variant="outline" onClick={toggleMenu} aria-label="Toggle Menu">
        <Menu className="w-6 h-6" />
      </Button>

      {/* Dropdown Menu */}
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
            <li>
              <button
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 w-full flex items-center space-x-2"
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span>{t("toggleTheme")}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  changeLanguage("en");
                  setIsOpen(false);
                }}
                className="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 w-full flex items-center space-x-2"
              >
                <Globe className="w-5 h-5" />
                <span>{t("english")}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  changeLanguage("ro");
                  setIsOpen(false);
                }}
                className="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 w-full flex items-center space-x-2"
              >
                <Globe className="w-5 h-5" />
                <span>{t("romanian")}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  changeLanguage("ru");
                  setIsOpen(false);
                }}
                className="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 w-full flex items-center space-x-2"
              >
                <Globe className="w-5 h-5" />
                <span>{t("russian")}</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
