import { useState } from "react";
import { ProfileInformation } from "./ProfileInformation";
import { ChangePassword } from "./ChangePassword";
import { AvatarUpload } from "./AvatarUpload";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/LoadingState";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

          {error && (
            <div className="mb-6 bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="space-y-6">
              <ProfileInformation setError={setError} setSuccess={setSuccess} />
              <AvatarUpload />
              <ThemeCustomizer />
              <ChangePassword setError={setError} setSuccess={setSuccess} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}