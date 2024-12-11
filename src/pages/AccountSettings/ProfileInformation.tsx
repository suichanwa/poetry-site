// src/pages/AccountSettings/ProfileInformation.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";

interface ProfileInformationProps {
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
}

export function ProfileInformation({ setError, setSuccess }: ProfileInformationProps) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, bio }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      user.name = data.name;
      user.email = data.email;
      user.bio = data.bio;
      setSuccess("Profile updated successfully");
      setError("");
    } catch (err) {
      setError("Failed to update profile");
      setSuccess("");
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-gray-500 dark:text-gray-400" />
            )}
          </div>
          <Button 
            variant="outline"
            onClick={() => setIsAvatarModalOpen(true)}
          >
            Change Avatar
          </Button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <Input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full"
          />
        </div>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={handleUpdateProfile}
        >
          Update Profile
        </Button>
      </div>
    </Card>
  );
}