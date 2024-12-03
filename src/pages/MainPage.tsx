import { useState } from "react";
import { PoemCard } from "@/components/PoemCard";
import { AddPoetryModal } from "@/components/AddPoetryModal";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MainPage({ poems, onAddPoetry }: { poems: { id: number; title: string; content: string; author: string }[], onAddPoetry: (title: string, content: string, author: string) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 relative">
      <main>
        <h2 className="text-2xl font-semibold mb-4">Poetry Feed</h2>
        <div className="space-y-4">
          {poems.map((poem, index) => (
            <PoemCard
              key={poem.id}
              {...poem}
              label={index === 0 ? "Poetry of the Month" : index === 1 ? "Poetry of the Week" : undefined}
            />
          ))}
        </div>
      </main>
      <Button
        variant="outline"
        onClick={toggleModal}
        aria-label="Add Poetry"
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 p-4"
      >
        <Plus className="w-8 h-8" />
      </Button>
      <AddPoetryModal isOpen={isModalOpen} onClose={toggleModal} onAddPoetry={onAddPoetry} />
    </div>
  );
}