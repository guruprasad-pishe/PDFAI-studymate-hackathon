const API_BASE_URL = 'http://localhost:8000';

export interface ChatMessage {
  message: string;
  chat_history?: Array<{ role: string; content: string }>;
}

export interface ChatResponse {
  response: string;
  sources?: string[];
}

export interface UploadResponse {
  message: string;
  filename: string;
}

class ChatService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `/api${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async uploadPDF(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async sendMessage(message: string, chatHistory: Array<{ role: string; content: string }> = []): Promise<ChatResponse> {
    const payload: ChatMessage = {
      message,
      chat_history: chatHistory,
    };

    return this.makeRequest<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.makeRequest<{ status: string; message: string }>('/health');
  }

  async resetConversation(): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('/reset-conversation', {
      method: 'POST',
    });
  }

  async getStatus(): Promise<{ initialized: boolean; has_database: boolean; has_qa_chain: boolean }> {
    return this.makeRequest<{ initialized: boolean; has_database: boolean; has_qa_chain: boolean }>('/status');
  }
}

export const chatService = new ChatService();
