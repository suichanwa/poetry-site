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
  const [error, setError] = useState<string>("");
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
    if (!image) return;

    setIsUploading(true);
    setError("");
    
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
        throw new Error(await response.text());
      }

      navigate('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Add a profile picture to personalize your account
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

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

          <div className="flex gap-4 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleSkip}
              disabled={isUploading}
            >
              Skip for now
            </Button>
            <Button
              className="flex-1"
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
                  Continue
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}