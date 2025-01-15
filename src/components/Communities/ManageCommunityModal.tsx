import { useState, useEffect } from "react";
import { 
  Modal,
  DialogTitle,
  DialogDescription
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface Rule {
  id?: number;
  title: string;
  description: string;
}

interface ManageCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  community: {
    id: number;
    name: string;
    description: string;
    isPrivate: boolean;
    rules: Rule[];
  };
  onUpdate: (updatedCommunity: any) => void;
}

export function ManageCommunityModal({
  isOpen,
  onClose,
  community,
  onUpdate
}: ManageCommunityModalProps) {
  const [name, setName] = useState(community.name);
  const [description, setDescription] = useState(community.description);
  const [isPrivate, setIsPrivate] = useState(community.isPrivate);
  const [rules, setRules] = useState<Rule[]>(community.rules);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(community.name);
    setDescription(community.description);
    setIsPrivate(community.isPrivate);
    setRules(community.rules);
  }, [community]);

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
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/communities/${community.id}`, {
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

      const updatedCommunity = await response.json();
      onUpdate(updatedCommunity);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 p-4">
        <DialogTitle className="text-2xl font-bold">Manage Community</DialogTitle>
        <DialogDescription>
          Update your community settings and rules.
        </DialogDescription>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              disabled={isLoading}
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
                disabled={isLoading}
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
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                <Input
                  placeholder="Rule Title"
                  value={rule.title}
                  onChange={(e) => handleUpdateRule(index, 'title', e.target.value)}
                  disabled={isLoading}
                />
                <Textarea
                  placeholder="Rule Description"
                  value={rule.description}
                  onChange={(e) => handleUpdateRule(index, 'description', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name || !description || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}