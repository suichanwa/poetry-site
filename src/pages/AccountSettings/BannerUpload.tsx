import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function BannerUpload() {
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
      formData.append('banner', image);

      const response = await fetch(`http://localhost:3000/api/users/${user.id}/banner`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      updateUser({ ...user, banner: data.banner });
      setSuccess("Banner updated successfully");
      setImage(null);
      setPreview(null);
    } catch (error) {
      setError("Failed to upload banner");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Change Banner</h2>
      <div className="space-y-4">
        <div className="relative h-32 bg-muted rounded-lg overflow-hidden">
          {(preview || user?.banner) && (
            <img 
              src={preview || `http://localhost:3000${user?.banner}`}
              alt="Banner preview"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <label className="cursor-pointer text-white">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isUploading}
              />
              <div className="flex flex-col items-center">
                <Image className="w-6 h-6 mb-2" />
                <span>Change Banner</span>
              </div>
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

        {image && (
          <Button 
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Uploading...
              </div>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Save Banner
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}