import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

interface MemberListProps {
  members: {
    id: number;
    name: string;
    avatar?: string;
  }[];
  creatorId: number;
}

export function MemberList({ members, creatorId }: MemberListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {members.map(member => (
        <Card key={member.id} className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {member.avatar ? (
                <img 
                  src={`http://localhost:3001${member.avatar}`}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <p className="font-medium">{member.name}</p>
              {member.id === creatorId && (
                <span className="text-xs text-primary">Creator</span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}