import React, { createContext, useContext, useState, ReactNode } from 'react';
import { chatService, ChatResponse } from '@/services/chatService';
import { toast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  isProcessingPDF: boolean;
  uploadedPDF: string | null;
  recentSearches: string[];
  sendMessage: (message: string) => Promise<void>;
  uploadPDF: (file: File) => Promise<void>;
  clearChat: () => void;
  resetConversation: () => void;
  addRecentSearch: (fileName: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPDF, setIsProcessingPDF] = useState(false);
  const [uploadedPDF, setUploadedPDF] = useState<string | null>(null);

  // Load recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    return savedSearches ? JSON.parse(savedSearches) : [];
  });

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(message);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPDF = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPDF(true);

    try {
      const response = await chatService.uploadPDF(file);
      setUploadedPDF(file.name);
      
      // Add to recent searches
      const newSearches = [file.name, ...recentSearches].slice(0, 10); // Keep last 10 searches
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
      setRecentSearches(newSearches);

      toast({
        title: "PDF uploaded successfully",
        description: `${file.name} has been processed and is ready for questions.`,
      });

      // Add a system message indicating PDF upload
      const systemMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'system',
        content: `PDF file ${file.name} has been uploaded and processed. You can now ask questions about its contents.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, systemMessage]);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to upload PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPDF(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setUploadedPDF(null);
  };

  const resetConversation = async () => {
    try {
      await chatService.resetConversation();
      setMessages([]);
      toast({
        title: "Conversation reset",
        description: "Chat history has been cleared.",
      });
    } catch (error) {
      console.error('Error resetting conversation:', error);
      toast({
        title: "Reset failed",
        description: "Failed to reset conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addRecentSearch = (fileName: string) => {
    const newSearches = [fileName, ...recentSearches].slice(0, 10); // Keep last 10 searches
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    setRecentSearches(newSearches);
  };

  const value: ChatContextType = {
    messages,
    isLoading,
    isProcessingPDF,
    uploadedPDF,
    recentSearches,
    sendMessage,
    uploadPDF,
    clearChat,
    resetConversation,
    addRecentSearch,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
