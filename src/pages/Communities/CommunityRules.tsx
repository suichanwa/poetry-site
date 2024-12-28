import { Card } from "@/components/ui/card";

interface CommunityRulesProps {
  rules: {
    id: number;
    title: string;
    description: string;
  }[];
}

export function CommunityRules({ rules }: CommunityRulesProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Community Rules</h2>
      {rules.length > 0 ? (
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div key={rule.id} className="border-b last:border-0 pb-4 last:pb-0">
              <h3 className="font-medium">
                {index + 1}. {rule.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No rules have been set for this community.</p>
      )}
    </Card>
  );
}