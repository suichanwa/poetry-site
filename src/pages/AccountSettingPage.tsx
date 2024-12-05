import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Lock, Save } from "lucide-react";

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleUpdateProfile = async () => {
    try {
      // Add API call to update profile here
      setSuccess("Profile updated successfully");
      setError("");
    } catch (err) {
      setError("Failed to update profile");
      setSuccess("");
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Add API call to update password here
      setSuccess("Password updated successfully");
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Failed to update password");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        {/* Profile Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-500 dark:text-gray-400" />
              </div>
              <Button variant="outline">Change Avatar</Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <div className="relative">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                  <User className="w-5 h-5 absolute left-3 top-2 text-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                  <Mail className="w-5 h-5 absolute left-3 top-2 text-gray-500" />
                </div>
              </div>
              <Button onClick={handleUpdateProfile} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </Card>

        {/* Password Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <div className="relative">
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pl-10"
                />
                <Lock className="w-5 h-5 absolute left-3 top-2 text-gray-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <div className="relative">
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10"
                />
                <Lock className="w-5 h-5 absolute left-3 top-2 text-gray-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <div className="relative">
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                />
                <Lock className="w-5 h-5 absolute left-3 top-2 text-gray-500" />
              </div>
            </div>
            <Button onClick={handleUpdatePassword} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </div>
        </Card>

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
      </div>
    </div>
  );
}