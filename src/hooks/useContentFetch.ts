import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useContentFetch() {
  const [poems, setPoems] = useState([]);
  const [mangas, setMangas] = useState([]);
  const [lightNovels, setLightNovels] = useState([]);
  const [books, setBooks] = useState([]);
  const [followingPoems, setFollowingPoems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchContent = async (endpoint, setter, isFollowing = false) => {
      try {
        const response = await fetch(`http://localhost:3001/api/${endpoint}`);
        const data = await response.json();
        setter(data);
      } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        toast({
          title: "Error",
          description: `Failed to fetch ${endpoint}`,
          status: "error",
        });
      }
    };

    if (user) fetchContent("poems/following", setFollowingPoems, true);
    fetchContent("poems", setPoems);
    fetchContent("manga", setMangas);
    fetchContent("lightnovels", setLightNovels);
    fetchContent("books", setBooks);
    
    setIsLoading(false);
  }, [user, toast]);

  return { poems, mangas, lightNovels, books, followingPoems, isLoading };
}