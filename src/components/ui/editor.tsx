// src/components/ui/editor.tsx
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Type
} from "lucide-react";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface Formatting {
  isBold: boolean;
  isItalic: boolean;
  alignment: 'left' | 'center' | 'right';
  fontSize: 'small' | 'medium' | 'large';
}

export function Editor({
  value,
  onChange,
  placeholder,
  disabled = false
}: EditorProps) {
  const [formatting, setFormatting] = useState<Formatting>({
    isBold: false,
    isItalic: false,
    alignment: 'left',
    fontSize: 'medium'
  });

  const toggleFormat = (type: keyof Formatting) => {
    setFormatting(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const setAlignment = (alignment: 'left' | 'center' | 'right') => {
    setFormatting(prev => ({
      ...prev,
      alignment
    }));
  };

  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    setFormatting(prev => ({
      ...prev,
      fontSize: size
    }));
  };

  return (
    <div className="w-full space-y-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 pb-2 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toggleFormat('isBold')}
          className={cn(formatting.isBold && "bg-muted")}
          disabled={disabled}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toggleFormat('isItalic')}
          className={cn(formatting.isItalic && "bg-muted")}
          disabled={disabled}
        >
          <Italic className="w-4 h-4" />
        </Button>
        
        <div className="h-4 w-px bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setAlignment('left')}
          className={cn(formatting.alignment === 'left' && "bg-muted")}
          disabled={disabled}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setAlignment('center')}
          className={cn(formatting.alignment === 'center' && "bg-muted")}
          disabled={disabled}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setAlignment('right')}
          className={cn(formatting.alignment === 'right' && "bg-muted")}
          disabled={disabled}
        >
          <AlignRight className="w-4 h-4" />
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setFontSize('small')}
          className={cn(formatting.fontSize === 'small' && "bg-muted")}
          disabled={disabled}
        >
          <Type className="w-3 h-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setFontSize('medium')}
          className={cn(formatting.fontSize === 'medium' && "bg-muted")}
          disabled={disabled}
        >
          <Type className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setFontSize('large')}
          className={cn(formatting.fontSize === 'large' && "bg-muted")}
          disabled={disabled}
        >
          <Type className="w-5 h-5" />
        </Button>
      </div>

      {/* Editor Area */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "min-h-[300px] resize-none",
          formatting.isBold && "font-bold",
          formatting.isItalic && "italic",
          `text-${formatting.alignment}`,
          {
            'text-sm': formatting.fontSize === 'small',
            'text-base': formatting.fontSize === 'medium',
            'text-lg': formatting.fontSize === 'large'
          }
        )}
      />
    </div>
  );
}