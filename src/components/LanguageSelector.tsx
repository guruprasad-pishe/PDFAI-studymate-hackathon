import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  outputLanguage: string;
  onOutputLanguageChange: (language: string) => void;
}

const languages = [
  { code: 'en-US', name: 'English (US)', voice: 'en-US' },
  { code: 'es-ES', name: 'Spanish', voice: 'es-ES' },
  { code: 'fr-FR', name: 'French', voice: 'fr-FR' },
  { code: 'de-DE', name: 'German', voice: 'de-DE' },
  { code: 'it-IT', name: 'Italian', voice: 'it-IT' },
  { code: 'pt-BR', name: 'Portuguese', voice: 'pt-BR' },
  { code: 'ru-RU', name: 'Russian', voice: 'ru-RU' },
  { code: 'ja-JP', name: 'Japanese', voice: 'ja-JP' },
  { code: 'ko-KR', name: 'Korean', voice: 'ko-KR' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', voice: 'zh-CN' },
  { code: 'ar-SA', name: 'Arabic', voice: 'ar-SA' },
  { code: 'hi-IN', name: 'Hindi', voice: 'hi-IN' }
];

const LanguageSelector = ({ 
  selectedLanguage, 
  onLanguageChange, 
  outputLanguage, 
  onOutputLanguageChange 
}: LanguageSelectorProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground"
          title="Language Settings"
        >
          <Globe className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-popover border-border">
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Language Settings</h3>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Voice Input Language</label>
            <Select value={selectedLanguage} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-full bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Response Language</label>
            <Select value={outputLanguage} onValueChange={onOutputLanguageChange}>
              <SelectTrigger className="w-full bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>• Voice input language determines speech recognition</p>
            <p>• Response language sets output text and speech</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSelector;