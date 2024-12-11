// src/pages/AccountSettings/AccountSettingsPage.tsx
import { useState } from "react";
import { ProfileInformation } from "./ProfileInformation";
import { ChangePassword } from "./ChangePassword";
import { AvatarUpload } from "./AvatarUpload";
//import { useAuth } from "@/context/AuthContext";

export default function AccountSettingsPage() {
  //const { user } = useAuth();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <ProfileInformation setError={setError} setSuccess={setSuccess} />
        <ChangePassword setError={setError} setSuccess={setSuccess} />
        <AvatarUpload />
      </div>
    </div>
  );
}