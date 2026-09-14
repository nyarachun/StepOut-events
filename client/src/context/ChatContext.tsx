import {
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import { io } from 'socket.io-client';

import { API_URL } from '../api/api';
import { getUnreadCount } from '../api/chats';
import { useAuth } from './AuthContext';
import { ChatContext } from './ChatContextValue';

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    const refreshUnreadCount = useCallback(async () => {
        if (!isAuthenticated) {
            setUnreadCount(0);
            return;
        }

        try {
            const count = await getUnreadCount();
            setUnreadCount(count);
        } catch {
            setUnreadCount(0);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const refresh = async () => {
            await refreshUnreadCount();
        };

        void refresh();
    }, [isAuthenticated, refreshUnreadCount]);

    useEffect(() => {
        if (!isAuthenticated || !user?.id) {
            return;
        }

        const client = io(API_URL, {
            transports: ['websocket'],
            query: { userId: String(user.id) },
        });

        client.on('unreadCount', (count: number) => {
            setUnreadCount(count);
        });

        client.on('newMessage', () => {
            void refreshUnreadCount();
        });

        return () => {
            client.off('unreadCount');
            client.off('newMessage');
            client.disconnect();
        };
    }, [isAuthenticated, refreshUnreadCount, user?.id]);

    const value = { unreadCount, refreshUnreadCount };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
