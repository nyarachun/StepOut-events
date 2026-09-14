import { createContext } from 'react';

export type ChatContextValue = {
    unreadCount: number;
    refreshUnreadCount: () => Promise<void>;
};

export const ChatContext = createContext<ChatContextValue | null>(null);
