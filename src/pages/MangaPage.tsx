// src/pages/MangaPage.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MangaGrid } from "@/components/MangaGrid";
import { LoadingState } from "@/components/LoadingState";

export default function MangaPage() {
  const [mangas, setMangas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleMangaClick = (mangaId: number) => {
    navigate(`/manga/${mangaId}`);
  };

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3001/api/manga');
        const data = await response.json();
        setMangas(data);
      } catch (error) {
        console.error('Failed to fetch manga:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMangas();
  }, []);

  if (isLoading) return <LoadingState />;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Manga Library</h1>
      <MangaGrid mangas={mangas} onMangaClick={handleMangaClick} />
    </div>
  );
}