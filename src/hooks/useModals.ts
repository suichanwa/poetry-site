import { useState } from "react";

export function useModals() {
  const [isPoemModalOpen, setIsPoemModalOpen] = useState(false);
  const [isMangaModalOpen, setIsMangaModalOpen] = useState(false);
  const [isLightNovelModalOpen, setIsLightNovelModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  return { 
    isPoemModalOpen, setIsPoemModalOpen,
    isMangaModalOpen, setIsMangaModalOpen,
    isLightNovelModalOpen, setIsLightNovelModalOpen,
    isBookModalOpen, setIsBookModalOpen
  };
}