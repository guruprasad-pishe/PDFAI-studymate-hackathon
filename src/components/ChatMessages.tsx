import { useChat } from '@/contexts/ChatContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Loader2, User, Bot } from 'lucide-react';

const ChatMessages = () => {
  const { messages, isLoading, uploadedPDF } = useChat();

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Bot className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">
              {uploadedPDF ? 'Ready to chat!' : 'Upload a PDF to get started'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {uploadedPDF 
                ? `Ask questions about "${uploadedPDF}" and I'll help you find the answers.`
                : 'Upload a PDF document to begin asking questions about its content.'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            
            <Card className={`max-w-[80%] p-4 ${
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs opacity-70">
                  {message.role === 'user' ? (
                    <>
                      <User className="w-3 h-3" />
                      <span>You</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3" />
                      <span>StudyMate</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </Card>
            
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <Card className="max-w-[80%] p-4 bg-muted">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
