// src/pages/Communities/CommunityManagePage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InviteUserModal } from "@/components/Communities/InviteUserModal";

export default function CommunityManagePage() {
  const { id } = useParams();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Community</h1>

        <Button onClick={() => setIsInviteModalOpen(true)}>
          Invite User
        </Button>

        <InviteUserModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          communityId={parseInt(id!)}
        />
      </div>
    </div>
  );
}