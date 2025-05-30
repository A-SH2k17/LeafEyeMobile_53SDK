import axios from 'axios';

const BASE_URL = 'https://leafeye.eu-1.sharedwithexpose.com/api';

export const chatService = {
    async getChatHistory() {
        try {
            const response = await axios.get(`${BASE_URL}/chat/history`);
            return response.data;
        } catch (error) {
            console.error('Error fetching chat history:', error);
            throw error;
        }
    },

    async createNewChat(firstMessage: string) {
        try {
            const response = await axios.post(`${BASE_URL}/chat/new`, {
                firstMessage
            });
            return response.data;
        } catch (error) {
            console.error('Error creating new chat:', error);
            throw error;
        }
    },

    async updateChat(chatId: number, messages: any[]) {
        try {
            const response = await axios.post(`${BASE_URL}/chat/update/${chatId}`, {
                messages
            });
            return response.data;
        } catch (error) {
            console.error('Error updating chat:', error);
            throw error;
        }
    },

    async generateChat(prompt: string) {
        try {
            const response = await axios.post(`${BASE_URL}/chat/generate`, {
                prompt,
                model: 'LeafEye-Mistral7b'
            });
            console.log('Chat generation response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error generating chat response:', error);
            throw error;
        }
    }
}; 