import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onBack?: () => void;
}

export function ErrorState({ error, onBack }: ErrorStateProps) {
  return (
    <div className="min-h-screen p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="text-center space-y-4">
          <div className="text-red-500 dark:text-red-400 text-lg">
            {error || 'Something went wrong'}
          </div>
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}