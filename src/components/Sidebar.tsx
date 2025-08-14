import { Plus, Search, FileText, Folder, Clock, Bot, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeSelector from './ThemeSelector';
import { RecentSearches } from './RecentSearches';
import { useChat } from '@/contexts/ChatContext';

const Sidebar = () => {
  const { recentSearches, clearChat } = useChat();

  return (
    <div className="w-80 h-screen bg-gradient-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-sidebar-foreground">Aivory</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeSelector />
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-smooth"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow transition-spring rounded-lg"
          size="lg"
          onClick={clearChat}
        >
          <Plus className="w-5 h-5 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        <nav className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-smooth"
          >
            <Search className="w-4 h-4 mr-3" />
            Explore
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-smooth"
          >
            <FileText className="w-4 h-4 mr-3" />
            Templates
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-smooth"
          >
            <Folder className="w-4 h-4 mr-3" />
            Directory
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-smooth"
          >
            <Clock className="w-4 h-4 mr-3" />
            History
          </Button>
        </nav>

        {/* Recent Searches */}
        <div className="mt-8">
          <RecentSearches className="px-2" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;