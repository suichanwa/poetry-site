import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, FileIcon, X } from "lucide-react";

interface LightNovelCoverUploadProps {
  coverFile: File | null;
  setCoverFile: (file: File | null) => void;
  isSubmitting: boolean;
  onError: (error: string) => void;
}

export function LightNovelCoverUpload({
  coverFile,
  setCoverFile,
  isSubmitting,
  onError
}: LightNovelCoverUploadProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onError('Cover image must be an image file');
      return;
    }
    setCoverFile(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Cover Image</label>
      <div className="flex items-center gap-2">
        <Upload className="w-4 h-4 text-muted-foreground" />
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          required
          disabled={isSubmitting}
        />
      </div>
      {coverFile && (
        <div className="flex items-center gap-2 p-2 mt-2 bg-muted rounded-md">
          <FileIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{coverFile.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setCoverFile(null)}
            className="ml-auto"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}