import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/contexts/ChatContext';

export const RecentSearches = ({ className = '' }: { className?: string }) => {
  const { recentSearches, uploadPDF } = useChat();

  const handleRecentSearchClick = async (fileName: string) => {
    // Find the file in recent searches
    const search = recentSearches.find(s => s === fileName);
    if (search) {
      // You can implement file retrieval logic here
      // For now, we'll just show a toast
      console.log('Retrieving file:', fileName);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Searches</h3>
        {recentSearches.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => localStorage.removeItem('recentSearches')}
          >
            Clear All
          </Button>
        )}
      </div>
      
      {recentSearches.length === 0 ? (
        <p className="text-muted-foreground">No recent searches yet</p>
      ) : (
        <div className="space-y-2">
          {recentSearches.map((fileName) => (
            <Button
              key={fileName}
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleRecentSearchClick(fileName)}
            >
              {fileName}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
