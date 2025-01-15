import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityId: number;
  onTopicCreated: (topic: any) => void;
}

export function CreateTopicModal({
  isOpen,
  onClose,
  communityId,
  onTopicCreated
}: CreateTopicModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          communityId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create topic');
      }

      const topic = await response.json();
      onTopicCreated(topic);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create topic');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold">Create New Topic</h2>
        
        <div>
          <Input
            placeholder="Topic Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Textarea
            placeholder="Topic Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Topic'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}