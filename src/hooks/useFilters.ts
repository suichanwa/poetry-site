import { useState, useEffect } from "react";

export function useFilters(poems) {
  const [filteredPoems, setFilteredPoems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const filtered = poems.filter((poem) => {
      const matchesSearch = searchQuery 
        ? poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          poem.content.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesTags = selectedTags.every((tag) => poem.tags.some((t) => t.name === tag));

      return matchesSearch && matchesTags;
    });

    setFilteredPoems(filtered);
  }, [searchQuery, selectedTags, poems]);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

  return { filteredPoems, searchQuery, setSearchQuery, selectedTags, availableTags, toggleTag, clearFilters, showFilters, setShowFilters };
}