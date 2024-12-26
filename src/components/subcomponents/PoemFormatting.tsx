import { Button } from "@/components/ui/button";
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface PoemFormattingProps {
  formatting: {
    isBold: boolean;
    isItalic: boolean;
    alignment: 'left' | 'center' | 'right';
    fontSize: 'small' | 'medium' | 'large';
  };
  setFormatting: (value: any) => void;
}

export function PoemFormatting({ formatting, setFormatting }: PoemFormattingProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setFormatting(prev => ({ ...prev, isBold: !prev.isBold }))}
        className={cn(formatting.isBold && "bg-accent")}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setFormatting(prev => ({ ...prev, isItalic: !prev.isItalic }))}
        className={cn(formatting.isItalic && "bg-accent")}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFormatting(prev => ({ ...prev, alignment: 'left' }))}
          className={cn(formatting.alignment === 'left' && "bg-accent")}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFormatting(prev => ({ ...prev, alignment: 'center' }))}
          className={cn(formatting.alignment === 'center' && "bg-accent")}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFormatting(prev => ({ ...prev, alignment: 'right' }))}
          className={cn(formatting.alignment === 'right' && "bg-accent")}
        >
          <AlignRight className="w-4 h-4" />
        </Button>
      </div>
      <select
        className="px-2 py-1 border rounded text-sm"
        value={formatting.fontSize}
        onChange={(e) => setFormatting(prev => ({ 
          ...prev, 
          fontSize: e.target.value as 'small' | 'medium' | 'large'
        }))}
      >
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
    </div>
  );
}