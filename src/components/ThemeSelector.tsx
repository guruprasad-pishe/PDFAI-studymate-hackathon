import { Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTheme, colorThemes } from '@/contexts/ThemeContext';

const ThemeSelector = () => {
  const { currentTheme, setTheme } = useTheme();

  const themeColors = [
    { key: 'emerald', color: 'bg-emerald-500', name: 'Emerald' },
    { key: 'crimson', color: 'bg-red-500', name: 'Crimson' },
    { key: 'sapphire', color: 'bg-blue-500', name: 'Sapphire' },
    { key: 'amethyst', color: 'bg-purple-500', name: 'Amethyst' },
    { key: 'amber', color: 'bg-yellow-500', name: 'Amber' },
    { key: 'rose', color: 'bg-rose-500', name: 'Rose' }
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-smooth"
          title="Change theme"
        >
          <Palette className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 bg-card border-border shadow-float" align="start">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Choose Theme</h3>
          
          <div className="grid grid-cols-3 gap-3">
            {themeColors.map((theme) => (
              <button
                key={theme.key}
                onClick={() => setTheme(theme.key)}
                className="group relative flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-spring"
                title={theme.name}
              >
                <div className="relative">
                  <div 
                    className={`w-8 h-8 rounded-full border-2 border-border shadow-sm transition-spring group-hover:scale-110`}
                    style={{
                      background: colorThemes[theme.key]?.gradient || theme.color
                    }}
                  />
                  {currentTheme === theme.key && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow-sm" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-accent-foreground transition-smooth">
                  {theme.name}
                </span>
                
                {/* Selection indicator */}
                {currentTheme === theme.key && (
                  <div 
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 rounded-full transition-smooth"
                    style={{
                      background: colorThemes[theme.key]?.gradient
                    }}
                  />
                )}
              </button>
            ))}
          </div>
          
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Theme changes apply instantly across the interface
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeSelector;