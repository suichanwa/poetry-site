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
    const fetchContent = async (endpoint: string, setter: (data: any) => void) => {
      try {
        const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch data');
        }
        const data = await response.json();
        setter(data);
      } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        toast({
          title: "Error",
          description: `Failed to fetch ${endpoint}`,
          variant: "destructive",
        });
      }
    };

    const fetchAllContent = async () => {
      try {
        setIsLoading(true);
        await fetchContent("poems", setPoems);
        await fetchContent("manga", setMangas);
        await fetchContent("lightnovels", setLightNovels);
        await fetchContent("books", setBooks);
        
        if (user) {
          await fetchContent(`users/${user.id}/poems`, setFollowingPoems);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllContent();
  }, [user, toast]);

  return { poems, mangas, lightNovels, books, followingPoems, isLoading };
}