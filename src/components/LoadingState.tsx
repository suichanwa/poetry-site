import { Card } from "@/components/ui/card";

export function LoadingState() {
  return (
    <div className="min-h-screen p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4" /> {/* Back button */}
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" /> {/* Title */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" /> {/* Avatar */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" /> {/* Author name */}
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" /> {/* Date */}
            </div>
          </div>
          <div className="space-y-2"> {/* Content */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        </div>
      </Card>
    </div>
  );
}