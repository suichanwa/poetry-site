import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProfileSetupPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  const handleUpload = async () => {
    if (!image) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', image);

      const response = await fetch(`http://localhost:3000/api/users/${user?.id}/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      navigate('/');
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-gray-500 dark:text-gray-400">Add a profile picture to personalize your account</p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-gray-500 dark:text-gray-400" />
            )}
          </div>

          <div className="flex flex-col items-center space-y-4 w-full">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button variant="outline" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Choose Photo</span>
              </Button>
            </label>

            <div className="flex space-x-4 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleSkip}
              >
                Skip for now
              </Button>
              <Button
                className="flex-1"
                onClick={handleUpload}
                disabled={!image || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}