import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Type, Text } from "lucide-react";
import { PoemTags } from "@/components/subcomponents/PoemTags";

interface LightNovelBasicInfoProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  isSubmitting: boolean;
}

export function LightNovelBasicInfo({
  title,
  setTitle,
  description,
  setDescription,
  tags,
  setTags,
  isSubmitting
}: LightNovelBasicInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-muted-foreground" />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Light Novel Title"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <div className="flex items-center gap-2">
          <Text className="w-4 h-4 text-muted-foreground" />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
            placeholder="Light Novel Description"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Remove the label here since PoemTags already includes it */}
      <PoemTags tags={tags} setTags={setTags} />
    </div>
  );
}