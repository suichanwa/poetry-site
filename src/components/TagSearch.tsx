// src/components/TagSearch.tsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface TagSearchProps {
  onSearch: (tags: string[]) => void;
}

export function TagSearch({ onSearch }: TagSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const tags = searchQuery.split(',').map(tag => tag.trim());
    onSearch(tags);
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Search by tags (comma separated)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />
      <Button onClick={handleSearch}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}