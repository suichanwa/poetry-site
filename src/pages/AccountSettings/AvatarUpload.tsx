import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function AvatarUpload() {
  const { user, updateUser } = useAuth();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size must be less than 5MB");
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!image || !user) return;

    setIsUploading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append('avatar', image);

      const response = await fetch(`http://localhost:3001/api/users/${user.id}/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error uploading avatar:', errorText);
        setError(errorText);
        setSuccess("");
        return;
      }

      const data = await response.json();
      
      // Update user context with new avatar
      if (user && data.avatar) {
        updateUser({ avatar: data.avatar });
      }
      
      setSuccess("Avatar updated successfully");
      setError("");
      
      // Reset form
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError("Failed to upload avatar");
      setSuccess("");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Change Avatar</h2>
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden group">
          {preview ? (
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-16 h-16 text-muted-foreground" />
          )}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <label className="cursor-pointer text-white text-sm">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isUploading}
              />
              Change Photo
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <Button 
          className="mt-4"
          onClick={handleUpload}
          disabled={!image || isUploading}
        >
          {isUploading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Uploading...
            </div>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}