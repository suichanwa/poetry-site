// src/pages/AccountSettings/AccountSettingsPage.tsx
import { useState } from "react";
import { ProfileInformation } from "./ProfileInformation";
import { ChangePassword } from "./ChangePassword";
import { AvatarUpload } from "./AvatarUpload";
import { BannerUpload } from "./BannerUpload";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/LoadingState";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, User, Lock, Image, Brush, Paintbrush } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SETTINGS_SECTIONS = [
  { id: 'profile', title: 'Profile Information', component: ProfileInformation, icon: User },
  { id: 'avatar', title: 'Avatar Settings', component: AvatarUpload, icon: Image },
  { id: 'banner', title: 'Banner Settings', component: BannerUpload, icon: Brush },
  { id: 'password', title: 'Password Settings', component: ChangePassword, icon: Lock },
  { id: 'theme', title: 'Theme Settings', component: ThemeCustomizer, icon: Paintbrush }
];

export default function AccountSettingsPage() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const CurrentSection = SETTINGS_SECTIONS[currentSectionIndex].component;

  const handleNext = () => {
    if (currentSectionIndex < SETTINGS_SECTIONS.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSectionIndex === 0}
              className="w-10 h-10 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentSectionIndex === SETTINGS_SECTIONS.length - 1}
              className="w-10 h-10 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {SETTINGS_SECTIONS.map((section, index) => (
            <Button
              key={section.id}
              variant={index === currentSectionIndex ? "default" : "outline"}
              className="flex-1 flex items-center gap-2 min-w-[120px] md:min-w-[150px]"
              onClick={() => setCurrentSectionIndex(index)}
            >
              <section.icon className="h-4 w-4" />
              <span className="hidden md:inline">{section.title}</span>
            </Button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSectionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}
              <CurrentSection setError={setError} setSuccess={setSuccess} />
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}