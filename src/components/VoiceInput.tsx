import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onLanguageChange: (language: string) => void;
  selectedLanguage: string;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
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

const VoiceInput = ({ onTranscript, onLanguageChange, selectedLanguage, isListening, setIsListening }: VoiceInputProps) => {
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Voice input active",
          description: "Listening for your voice..."
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          onTranscript(finalTranscript);
          toast({
            title: "Speech recognized",
            description: finalTranscript.slice(0, 50) + (finalTranscript.length > 50 ? '...' : '')
          });
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice input error",
          description: "Please check your microphone and try again",
          variant: "destructive"
        });
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [selectedLanguage, onTranscript, setIsListening]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
    }
  }, [selectedLanguage]);

  const toggleListening = async () => {
    if (!isSupported) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive"
      });
      return;
    }

    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognitionRef.current.start();
      } catch (error) {
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to use voice input",
          variant: "destructive"
        });
      }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      const currentLang = languages.find(lang => lang.code === selectedLanguage);
      utterance.lang = currentLang?.voice || 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Speech error",
          description: "Unable to play audio",
          variant: "destructive"
        });
      };

      speechSynthesis.speak(utterance);
      
      toast({
        title: "Playing audio",
        description: "Text-to-speech activated"
      });
    } else {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support text-to-speech",
        variant: "destructive"
      });
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Language Selector */}
      <Select value={selectedLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-40 h-8 text-xs bg-background border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="text-xs">
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Voice Input Button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={toggleListening}
        disabled={!isSupported}
        className={`h-8 w-8 p-0 transition-spring ${
          isListening 
            ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse' 
            : 'hover:bg-accent hover:text-accent-foreground'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </Button>

      {/* Text-to-Speech Button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          if (isSpeaking) {
            stopSpeaking();
          } else {
            // This would be called with the AI response text
            speakText("Hello! I'm ready to help you with your questions.");
          }
        }}
        className={`h-8 w-8 p-0 transition-spring ${
          isSpeaking 
            ? 'bg-primary hover:bg-primary/90 text-primary-foreground animate-pulse' 
            : 'hover:bg-accent hover:text-accent-foreground'
        }`}
        title={isSpeaking ? 'Stop speaking' : 'Test text-to-speech'}
      >
        <Volume2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default VoiceInput;