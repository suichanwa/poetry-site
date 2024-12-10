import { useState, useEffect } from "react";
import { PoemCard } from "@/components/PoemCard";
import { AddPoetryModal } from "@/components/AddPoetryModal";
import { Button } from "@/components/ui/button";

export default function MainPage() {
  const [poems, setPoems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/poems');
        const data = await response.json();
        setPoems(data);
      } catch (error) {
        console.error('Failed to fetch poems:', error);
      }
    };

    fetchPoems();
  }, []);

  const handleAddPoetry = (newPoem) => {
    setPoems(prevPoems => [newPoem, ...prevPoems]); 
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Poetry Feed</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Poem</Button>
      </div>
      <div className="space-y-4">
        {poems.map((poem) => (
          <PoemCard key={poem.id} {...poem} />
        ))}
      </div>
      <AddPoetryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPoetry={handleAddPoetry}
      />
    </div>
  );
}