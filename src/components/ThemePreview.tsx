import { useTheme } from '@/contexts/ThemeContext';
import { Sparkles } from 'lucide-react';

const ThemePreview = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-float">
      <div 
        className="w-4 h-4 rounded-full border border-border shadow-sm"
        style={{ background: theme.gradient }}
      />
      <Sparkles className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium text-foreground">{theme.name}</span>
    </div>
  );
};

export default ThemePreview;