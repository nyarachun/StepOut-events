import { api } from './api';

export type ChatParticipant = {
    id: number;
    user: {
        id: number;
        name: string;
    };
};

export type Chat = {
    id: number;
    type: 'event' | 'squad' | 'admin';
    event: {
        id: number;
        title: string;
    } | null;
    squad: {
        id: number;
    } | null;
    participants: ChatParticipant[];
    createdAt: string;
};

export type Message = {
    id: number;
    text: string;
    isSystem: boolean;
    createdAt: string;
    sender: {
        id: number;
        name: string;
    } | null;
};

export const getMyChats = async () => {
    const response =
        await api.get<Chat[]>('/chats');

    return response.data;
};

export const getUnreadCount = async () => {
    const response =
        await api.get<number>('/chats/unread');

    return response.data;
};

export const markChatAsRead = async (
    chatId: number,
) => {
    const response =
        await api.post<{ unreadCount: number }>(
            `/chats/${chatId}/read`,
        );

    return response.data;
};

export const getChatMessages = async (
    chatId: number,
) => {
    const response =
        await api.get<Message[]>(
            `/chats/${chatId}/messages`,
        );

    return response.data;
};

export const sendMessage = async (
    chatId: number,
    text: string,
) => {
    const response =
        await api.post<Message>(
            `/chats/${chatId}/messages`,
            {
                text,
            },
        );

    return response.data;
};

export const createEventChat = async (
    eventId: number,
    message: string,
) => {
    const response =
        await api.post<Chat>(
            '/chats/events',
            {
                eventId,
                message,
            },
        );

    return response.data;
};