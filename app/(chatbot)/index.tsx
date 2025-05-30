import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { chatService } from '../services/chatService';
import { ChatHistoryItem, ChatMessage } from '../types/chat';

// Sample data for demonstration
const sampleChatHistory: ChatHistoryItem[] = [
    {
        id: 1,
        title: 'Plant Care Questions',
        timestamp: '2024-03-15 10:30 AM',
        preview: 'How to care for my succulent?',
        date_interacted: '2024-03-15T10:30:00Z'
    },
    {
        id: 2,
        title: 'Disease Identification',
        timestamp: '2024-03-14 02:15 PM',
        preview: 'Help identify plant disease',
        date_interacted: '2024-03-14T14:15:00Z'
    },
];

const sampleMessages: ChatMessage[] = [
    {
        id: 1,
        role: 'system',
        content: 'Hello! I\'m your plant care system. How can I help you today?',
        timestamp: '10:30 AM'
    },
    {
        id: 2,
        role: 'user',
        content: 'How do I take care of my succulent?',
        timestamp: '10:31 AM'
    },
    {
        id: 3,
        role: 'system',
        content: 'Succulents need well-draining soil, bright indirect sunlight, and infrequent watering. Water only when the soil is completely dry, usually every 1-2 weeks.',
        timestamp: '10:31 AM'
    },
];

export default function ChatbotScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedChat, setSelectedChat] = useState<ChatHistoryItem | null>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
    const scrollViewRef = useRef<ScrollView>(null);
    const router = useRouter();

    useEffect(() => {
        fetchChatHistory();
    }, []);

    const fetchChatHistory = async () => {
        try {
            const data = await chatService.getChatHistory();
            setChatHistory(data);
        } catch (error) {
            console.error('Error fetching chat history:', error);
            Alert.alert('Error', 'Failed to load chat history');
        }
    };

    const startNewChat = () => {
        setSelectedChat(null);
        setMessages([]);
        setMessage('');
        setCurrentMessage('');
    };

    const selectChat = (chat: ChatHistoryItem) => {
        setSelectedChat(chat);
        try {
            const parsedMessages = JSON.parse(chat.content || '[]');
            setMessages(parsedMessages);
        } catch (error) {
            console.error('Error parsing chat messages:', error);
            setMessages([]);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        let newChat: ChatHistoryItem | null = null;
        const userMessage: ChatMessage = {
            id: Date.now(),
            role: 'user',
            content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // If this is a new chat, create it first
        if (!selectedChat) {
            try {
                newChat = await chatService.createNewChat(message);
                setSelectedChat(newChat);
                if (newChat) {
                    setChatHistory(prev => [newChat as ChatHistoryItem, ...prev]);
                }
            } catch (error) {
                console.error('Error creating new chat:', error);
                Alert.alert('Error', 'Failed to create new chat');
                return;
            }
        }

        setMessages(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);

        try {
            const response = await chatService.generateChat(message);
            console.log(response)
            const botMessage: ChatMessage = {
                id: Date.now(),
                role: 'system',
                content: response.response || response.message || 'Sorry, I could not generate a response.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            const updatedMessages = [...messages, userMessage, botMessage];
            setMessages(updatedMessages);

            // Update chat in database
            if (selectedChat || newChat) {
                await chatService.updateChat(
                    (selectedChat || newChat)!.id,
                    updatedMessages
                );
            }
        } catch (error) {
            console.error('Error generating response:', error);
            Alert.alert('Error', 'Failed to get response from AI');
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'system',
                content: 'Sorry, there was an error processing your request.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderChatItem = (chat: ChatHistoryItem) => (
        <TouchableOpacity
            key={chat.id}
            style={[
                styles.chatItem,
                selectedChat?.id === chat.id && styles.selectedChatItem
            ]}
            onPress={() => selectChat(chat)}
        >
            <View style={styles.chatItemContent}>
                <Text style={styles.chatTitle}>{chat.title}</Text>
                <Text style={styles.chatTimestamp}>
                    {new Date(chat.date_interacted).toLocaleString()}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#4CAF50" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Plant Care Assistant</Text>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.mainContent}>
                    <View style={styles.sidebar}>
                        <View style={styles.sidebarHeader}>
                            <Text style={styles.sidebarTitle}>Chat History</Text>
                            <TouchableOpacity onPress={startNewChat} style={styles.newChatButton}>
                                <Ionicons name="add" size={24} color="#4CAF50" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.chatHistory}>
                            {chatHistory.map(renderChatItem)}
                        </ScrollView>
                    </View>

                    <View style={styles.chatArea}>
                        <View style={styles.chatHeader}>
                            <View style={styles.chatHeaderContent}>
                                <Ionicons name="leaf" size={24} color="#4CAF50" />
                                <Text style={styles.chatHeaderTitle}>
                                    {selectedChat ? selectedChat.title : 'New Chat'}
                                </Text>
                            </View>
                            {selectedChat && (
                                <TouchableOpacity
                                    onPress={startNewChat}
                                    style={styles.newChatButton}
                                >
                                    <Text style={styles.newChatButtonText}>Start New Chat</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <ScrollView
                            ref={scrollViewRef}
                            style={styles.messagesContainer}
                            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                            keyboardShouldPersistTaps="handled"
                        >
                            {messages.length === 0 && !selectedChat && (
                                <View style={styles.emptyState}>
                                    <Ionicons name="leaf" size={48} color="#4CAF50" />
                                    <Text style={styles.emptyStateTitle}>Start a New Conversation</Text>
                                    <Text style={styles.emptyStateText}>Ask me anything about plant care!</Text>
                                </View>
                            )}
                            {messages.map((msg, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.messageContainer,
                                        msg.role === 'user' ? styles.userMessage : styles.botMessage
                                    ]}
                                >
                                    {msg.role === 'system' && (
                                        <Ionicons name="leaf" size={20} color="#4CAF50" style={styles.messageIcon} />
                                    )}
                                    <View style={[
                                        styles.messageContent,
                                        msg.role === 'user' ? styles.userMessageContent : styles.botMessageContent
                                    ]}>
                                        <Text style={[
                                            styles.messageText,
                                            msg.role === 'user' ? styles.userMessageText : styles.botMessageText
                                        ]}>{msg.content}</Text>
                                        <Text style={styles.messageTimestamp}>{msg.timestamp}</Text>
                                    </View>
                                    {msg.role === 'user' && (
                                        <Ionicons name="person" size={20} color="#666" style={styles.messageIcon} />
                                    )}
                                </View>
                            ))}
                            {isLoading && (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator color="#4CAF50" />
                                </View>
                            )}
                        </ScrollView>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Ask about plant care..."
                                placeholderTextColor="#999"
                                multiline
                            />
                            <TouchableOpacity
                                style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                                onPress={handleSendMessage}
                                disabled={!message.trim() || isLoading}
                            >
                                <Ionicons name="send" size={24} color={message.trim() ? "#4CAF50" : "#999"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    mainContent: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        width: '30%',
        borderRightWidth: 1,
        borderRightColor: '#eee',
    },
    sidebarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sidebarTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    newChatButton: {
        padding: 8,
    },
    chatHistory: {
        flex: 1,
    },
    chatItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedChatItem: {
        backgroundColor: '#f0f9f0',
    },
    chatItemContent: {
        flex: 1,
    },
    chatTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    chatTimestamp: {
        fontSize: 12,
        color: '#666',
    },
    chatArea: {
        flex: 1,
        flexDirection: 'column',
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    chatHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatHeaderTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    newChatButtonText: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: '500',
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        maxWidth: '80%',
    },
    userMessage: {
        alignSelf: 'flex-end',
    },
    botMessage: {
        alignSelf: 'flex-start',
    },
    messageContent: {
        padding: 12,
        borderRadius: 16,
        maxWidth: '100%',
    },
    userMessageContent: {
        backgroundColor: '#4CAF50',
    },
    botMessageContent: {
        backgroundColor: '#f0f0f0',
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
    },
    userMessageText: {
        color: '#fff',
    },
    botMessageText: {
        color: '#333',
    },
    messageTimestamp: {
        fontSize: 10,
        color: '#999',
        marginTop: 4,
    },
    messageIcon: {
        marginHorizontal: 8,
        alignSelf: 'flex-end',
    },
    loadingContainer: {
        padding: 16,
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        maxHeight: 100,
        fontSize: 14,
        color: '#333',
    },
    sendButton: {
        padding: 8,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
}); 