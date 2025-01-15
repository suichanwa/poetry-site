import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface ChangePasswordProps {
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
}

export function ChangePassword({ setError, setSuccess }: ChangePasswordProps) {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/users/${user?.id}/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          currentPassword, 
          newPassword 
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error updating password:', errorText);
        setError(errorText);
        setSuccess("");
        return;
      }

      setSuccess("Password updated successfully");
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error('Error updating password:', err);
      setError("Failed to update password");
      setSuccess("");
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Current Password</label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirm New Password</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full"
          />
        </div>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={handleUpdatePassword}
        >
          Update Password
        </Button>
      </div>
    </Card>
  );
}