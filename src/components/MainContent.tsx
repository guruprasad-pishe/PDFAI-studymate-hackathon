import { useState } from 'react';
import { Database, Settings, BarChart } from 'lucide-react';
import FeatureCard from './FeatureCard';
import FileUpload from './FileUpload';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import ThemePreview from './ThemePreview';
import { useChat } from '@/contexts/ChatContext';

const MainContent = () => {
  const [showUpload, setShowUpload] = useState(false);
  const { uploadedPDF } = useChat();

  const features = [
    {
      icon: Database,
      title: "Query Response Time",
      description: "Faster responses improve user experience and retention.",
      iconColor: "text-orange-500"
    },
    {
      icon: Settings,
      title: "Search Accuracy Rate", 
      description: "Higher accuracy ensures users find relevant information efficiently.",
      iconColor: "text-primary"
    },
    {
      icon: BarChart,
      title: "User Query Volume",
      description: "Helps assess system load, user engagement, and feature adoption.",
      iconColor: "text-purple-500"
    }
  ];

  const handleFileSelect = (newFiles: File[]) => {
    // Files are handled by the chat context now
  };

  const handleAttachFile = () => {
    setShowUpload(!showUpload);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background relative">
      {/* Theme Preview */}
      <ThemePreview />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-primary bg-clip-text text-transparent">
              StudyMate AI Assistant
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a PDF document and ask questions about its content.
              I'll help you find the answers you need.
            </p>
          </div>

          {/* File Upload Section */}
          {showUpload && (
            <div className="mb-12">
              <FileUpload 
                onFileSelect={handleFileSelect}
                className="max-w-2xl mx-auto"
              />
            </div>
          )}

          {/* Chat Messages */}
          <ChatMessages />

          {/* Spacer to push chat input to bottom */}
          <div className="h-32" />
        </div>
      </div>

      {/* Chat Input - Fixed at Bottom */}
      <ChatInput
        onAttachFile={handleAttachFile}
      />
    </div>
  );
};

export default MainContent;