import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, ChevronDown } from 'lucide-react';

interface PoemFormattingProps {
  formatting: {
    isBold: boolean;
    isItalic: boolean;
    alignment: 'left' | 'center' | 'right';
    fontSize: 'small' | 'medium' | 'large';
  };
  setFormatting: (formatting: PoemFormattingProps['formatting']) => void;
}

export function PoemFormatting({ formatting, setFormatting }: PoemFormattingProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFormatChange = (key: keyof PoemFormattingProps['formatting'], value: any) => {
    setFormatting({ ...formatting, [key]: value });
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant={formatting.isBold ? 'default' : 'outline'}
        onClick={() => handleFormatChange('isBold', !formatting.isBold)}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant={formatting.isItalic ? 'default' : 'outline'}
        onClick={() => handleFormatChange('isItalic', !formatting.isItalic)}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" onClick={handleDropdownToggle}>
            <AlignLeft className="w-4 h-4" />
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleFormatChange('alignment', 'left')}>
            <AlignLeft className="w-4 h-4 mr-2" />
            Left
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFormatChange('alignment', 'center')}>
            <AlignCenter className="w-4 h-4 mr-2" />
            Center
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFormatChange('alignment', 'right')}>
            <AlignRight className="w-4 h-4 mr-2" />
            Right
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}