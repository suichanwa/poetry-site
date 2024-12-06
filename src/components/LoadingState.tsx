export function LoadingState() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-4/6" />
      </div>
    </div>
  );
}