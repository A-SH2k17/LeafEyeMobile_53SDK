export interface ChatHistoryItem {
    id: number;
    title: string;
    timestamp: string;
    preview: string;
    date_interacted: string;
    content?: string;
}

export interface ChatMessage {
    id: number;
    role: 'user' | 'system';
    content: string;
    timestamp: string;
} 