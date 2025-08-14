import { useState, useRef, DragEvent } from 'react';
import { Upload, X, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useChat } from '@/contexts/ChatContext';

interface FileUploadProps {
  onFileSelect?: (files: File[]) => void;
  className?: string;
}

const FileUpload = ({ onFileSelect, className = "" }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPDF, isProcessingPDF } = useChat();

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => {
      const isValid = file.size <= 10 * 1024 * 1024; // 10MB limit
      if (!isValid) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive"
        });
      }
      return isValid;
    });

    // Process each PDF file
    for (const file of validFiles) {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        await uploadPDF(file);
      }
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
    onFileSelect?.(validFiles);
    
    if (validFiles.length > 0) {
      toast({
        title: "Files uploaded",
        description: `${validFiles.length} file(s) ready for processing`
      });
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drag & Drop Zone */}
      <div
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-spring cursor-pointer
          ${isDragOver 
            ? 'border-upload-zone-active bg-upload-zone-active/5 shadow-glow' 
            : 'border-border bg-upload-zone hover:border-primary/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center transition-spring ${
            isDragOver ? 'border-upload-zone-active text-upload-zone-active' : 'border-muted-foreground text-muted-foreground'
          }`}>
            <Upload className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">
              {isDragOver ? 'Drop PDF here' : 'Upload PDF'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Drag & drop PDF files here or click to browse. Maximum file size: 10MB
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="bg-transparent border-border hover:bg-primary hover:text-primary-foreground transition-spring"
          >
            Browse Files
          </Button>
        </div>
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf"
        aria-label="Upload PDF files"
      />

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Uploaded Files</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-feature-card border border-border rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <File className="w-4 h-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;