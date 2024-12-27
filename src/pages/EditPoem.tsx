import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PoemFormatting } from "@/components/subcomponents/PoemFormatting";
import { PoemTags } from "@/components/subcomponents/PoemTags";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";

export default function EditPoem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [formatting, setFormatting] = useState({
    isBold: false,
    isItalic: false,
    alignment: 'left' as const,
    fontSize: 'medium' as const
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPoem = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/poems/${id}`);
        if (!response.ok) throw new Error('Failed to fetch poem');
        
        const poem = await response.json();
        
        // Verify ownership
        if (poem.author.id !== user?.id) {
          navigate('/');
          return;
        }

        setTitle(poem.title);
        setContent(poem.content);
        setTags(poem.tags.map((t: any) => t.name));
        setFormatting(poem.formatting || {});
      } catch (error) {
        setError('Failed to load poem');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoem();
  }, [id, user]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/poems/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          tags,
          formatting
        }),
      });

      if (!response.ok) throw new Error('Failed to update poem');

      navigate(`/poem/${id}`);
    } catch (error) {
      setError('Failed to update poem');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="text-2xl font-bold mb-6">Edit Poem</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <PoemFormatting formatting={formatting} setFormatting={setFormatting} />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[200px]"
            />
          </div>

          <PoemTags tags={tags} setTags={setTags} />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}