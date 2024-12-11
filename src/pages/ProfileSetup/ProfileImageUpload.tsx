import { User } from "lucide-react";

interface ProfileImageUploadProps {
  preview: string | null;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export function ProfileImageUpload({ preview, handleImageChange, isUploading }: ProfileImageUploadProps) {
  return (
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
    </div>
  );
}