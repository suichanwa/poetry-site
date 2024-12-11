// src/pages/ProfileSetup/ProfileForm.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ProfileFormProps {
  name: string;
  setName: (name: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  handleSkip: () => void;
  handleUpload: () => void;
  isUploading: boolean;
  image: File | null;
}

export function ProfileForm({ name, setName, bio, setBio, handleSkip, handleUpload, isUploading, image }: ProfileFormProps) {
  return (
    <div className="w-full space-y-4">
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
        <label className="block text-sm font-medium mb-1">Bio</label>
        <Input
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full"
        />
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
  );
}