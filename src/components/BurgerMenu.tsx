import { useState } from "react";
import { Menu, Sun, Moon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);

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
                Home
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
                Register
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
                Login
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
                <span>Toggle Theme</span>
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
                <span>English</span>
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
                <span>Romanian</span>
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
                <span>Russian</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}