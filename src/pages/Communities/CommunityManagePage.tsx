import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";

interface Rule {
  id?: number;
  title: string;
  description: string;
}

export default function CommunityManagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/communities/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch community');
        
        const community = await response.json();
        
        // Verify if user is moderator
        if (community.creator.id !== user?.id) {
          navigate(`/communities/${id}`);
          return;
        }

        setName(community.name);
        setDescription(community.description);
        setIsPrivate(community.isPrivate);
        setRules(community.rules);
      } catch (error) {
        setError('Failed to load community');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunity();
  }, [id, user, navigate]);

  const handleAddRule = () => {
    setRules([...rules, { title: '', description: '' }]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleUpdateRule = (index: number, field: keyof Rule, value: string) => {
    const updatedRules = rules.map((rule, i) => 
      i === index ? { ...rule, [field]: value } : rule
    );
    setRules(updatedRules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/communities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          isPrivate,
          rules: rules.filter(rule => rule.title && rule.description)
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update community');
      }

      navigate(`/communities/${id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <Card className="max-w-4xl mx-auto p-6">
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/communities/${id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Community
          </Button>
          <h1 className="text-2xl font-bold">Manage Community</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              disabled={isSaving}
            />
            <Label htmlFor="private">Private Community</Label>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Community Rules</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddRule}
                disabled={isSaving}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
            </div>

            {rules.map((rule, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-md">
                <div className="flex justify-between items-start">
                  <Label>Rule {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRule(index)}
                    disabled={isSaving}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                <Input
                  placeholder="Rule Title"
                  value={rule.title}
                  onChange={(e) => handleUpdateRule(index, 'title', e.target.value)}
                  disabled={isSaving}
                />
                <Textarea
                  placeholder="Rule Description"
                  value={rule.description}
                  onChange={(e) => handleUpdateRule(index, 'description', e.target.value)}
                  disabled={isSaving}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/communities/${id}`)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name || !description || isSaving}
            >
              {isSaving ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}