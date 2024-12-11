import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileForm } from "./ProfileForm";
import { ProfileImageUpload } from "./ProfileImageUpload";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProfileSetupPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const handleSkip = () => {
    navigate('/');
  };

  const handleUpload = async () => {
    if (!image || !user) return;

    setIsUploading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append('avatar', image);
      formData.append('name', name);
      formData.append('bio', bio);

      const response = await fetch(`http://localhost:3000/api/users/${user.id}/setup-profile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error uploading profile:', errorText);
        setError(errorText);
        return;
      }

      const data = await response.json();
      
      // Update user context with new data
      if (data.avatar) {
        user.avatar = data.avatar;
      }
      user.name = name;
      user.bio = bio;

      navigate('/');
    } catch (error) {
      console.error('Error uploading profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md p-6 space-y-6">
        <ProfileHeader />
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <ProfileImageUpload 
          preview={preview || (user?.avatar ? `http://localhost:3000${user.avatar}` : null)}
          handleImageChange={handleImageChange} 
          isUploading={isUploading} 
        />
        <ProfileForm 
          name={name || user?.name || ''} 
          setName={setName} 
          bio={bio || user?.bio || ''} 
          setBio={setBio} 
          handleSkip={handleSkip} 
          handleUpload={handleUpload} 
          isUploading={isUploading} 
          image={image} 
        />
      </Card>
    </div>
  );
}