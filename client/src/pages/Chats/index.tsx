import {
    MessageCircle,
    Send,
} from 'lucide-react';
import {
    useEffect,
    useMemo,
    useState,
    type FormEvent,
} from 'react';
import {
    useSearchParams,
} from 'react-router-dom';

import {
    getChatMessages,
    getMyChats,
    markChatAsRead,
    sendMessage,
    type Chat,
    type Message,
} from '../../api/chats';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/useChat';

import './Chats.scss';

const Chats = () => {
    const { isAuthenticated } =
        useAuth();
    const { refreshUnreadCount } =
        useChat();

    const [searchParams] =
        useSearchParams();

    const requestedChatId =
        Number(
            searchParams.get('chat'),
        );

    const [chats, setChats] =
        useState<Chat[]>([]);

    const [messages, setMessages] =
        useState<Message[]>([]);

    const [
        selectedChatId,
        setSelectedChatId,
    ] = useState<number | null>(null);

    const [messageText, setMessageText] =
        useState('');

    const [isLoading, setIsLoading] =
        useState(true);

    const [
        isMessagesLoading,
        setIsMessagesLoading,
    ] = useState(false);

    const [isSending, setIsSending] =
        useState(false);

    const [error, setError] =
        useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const loadChats = async () => {
            setIsLoading(true);
            setError('');

            try {
                const data =
                    await getMyChats();

                setChats(data);

                if (
                    requestedChatId &&
                    data.some(
                        (chat) =>
                            chat.id ===
                            requestedChatId,
                    )
                ) {
                    setSelectedChatId(
                        requestedChatId,
                    );

                    return;
                }

                if (
                    data.length > 0
                ) {
                    setSelectedChatId(
                        data[0].id,
                    );
                } else {
                    setSelectedChatId(null);
                }
            } catch {
                setError(
                    'Could not load chats.',
                );
            } finally {
                setIsLoading(false);
            }
        };

        void loadChats();
    }, [
        isAuthenticated,
        requestedChatId,
    ]);

    useEffect(() => {
        if (
            selectedChatId === null
        ) {
            return;
        }

        const loadMessages =
            async () => {
                setIsMessagesLoading(
                    true,
                );
                setError('');

                try {
                    const data =
                        await getChatMessages(
                            selectedChatId,
                        );

                    setMessages(data);
                } catch {
                    setError(
                        'Could not load messages.',
                    );
                } finally {
                    setIsMessagesLoading(
                        false,
                    );
                }
            };

        void loadMessages();
    }, [selectedChatId]);

    useEffect(() => {
        if (
            !selectedChatId ||
            !isAuthenticated
        ) {
            return;
        }

        const handleRead = async () => {
            try {
                await markChatAsRead(
                    selectedChatId,
                );
                await refreshUnreadCount();
            } catch {
                // ignore read-mark errors; they are not fatal
            }
        };

        void handleRead();
    }, [
        isAuthenticated,
        refreshUnreadCount,
        selectedChatId,
    ]);

    const selectedChat = useMemo(
        () =>
            chats.find(
                (chat) =>
                    chat.id ===
                    selectedChatId,
            ) || null,
        [chats, selectedChatId],
    );

    const getChatTitle = (
        chat: Chat,
    ) => {
        if (chat.type === 'admin') {
            return 'StepOut Admin';
        }

        if (
            chat.type === 'event' &&
            chat.event
        ) {
            return chat.event.title;
        }

        if (chat.type === 'squad') {
            return 'Squad chat';
        }

        const participant =
            chat.participants[0];

        return (
            participant?.user.name ||
            'Chat'
        );
    };

    const getChatType = (
        chat: Chat,
    ) => {
        if (chat.type === 'admin') {
            return 'Admin';
        }

        if (chat.type === 'squad') {
            return 'Squad';
        }

        return 'Event';
    };

    const handleSend = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const text =
            messageText.trim();

        if (
            !text ||
            selectedChatId === null
        ) {
            return;
        }

        setIsSending(true);
        setError('');

        try {
            const message =
                await sendMessage(
                    selectedChatId,
                    text,
                );

            setMessages(
                (
                    currentMessages,
                ) => [
                        ...currentMessages,
                        message,
                    ],
            );

            setMessageText('');
        } catch {
            setError(
                'Could not send message.',
            );
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <main className="chats-page">
                <div className="chats-page__loading">
                    Loading chats...
                </div>
            </main>
        );
    }

    return (
        <main className="chats-page">
            <div className="chats-page__container">
                <header className="chats-page__header">
                    <span>
                        MESSAGES
                    </span>

                    <h1>Chats</h1>

                    <p>
                        Talk to event
                        organizers and
                        your squads.
                    </p>
                </header>

                {error && (
                    <p className="chats-page__error">
                        {error}
                    </p>
                )}

                <div className="chats-page__layout">
                    <aside className="chats-page__sidebar">
                        {chats.length ===
                            0 ? (
                            <div className="chats-page__empty">
                                <MessageCircle
                                    size={
                                        28
                                    }
                                />

                                <p>
                                    No chats
                                    yet
                                </p>
                            </div>
                        ) : (
                            chats.map(
                                (
                                    chat,
                                ) => (
                                    <button
                                        key={
                                            chat.id
                                        }
                                        type="button"
                                        className={`chats-page__chat-item ${selectedChatId ===
                                            chat.id
                                            ? 'is-active'
                                            : ''
                                            }`}
                                        onClick={() =>
                                            setSelectedChatId(
                                                chat.id,
                                            )
                                        }
                                    >
                                        <div className="chats-page__chat-icon">
                                            <MessageCircle
                                                size={
                                                    18
                                                }
                                            />
                                        </div>

                                        <div className="chats-page__chat-info">
                                            <strong>
                                                {getChatTitle(
                                                    chat,
                                                )}
                                            </strong>

                                            <span>
                                                {getChatType(
                                                    chat,
                                                )}
                                            </span>
                                        </div>
                                    </button>
                                ),
                            )
                        )}
                    </aside>

                    <section className="chats-page__conversation">
                        {!selectedChat ? (
                            <div className="chats-page__no-chat">
                                <MessageCircle
                                    size={
                                        38
                                    }
                                />

                                <h2>
                                    Select a
                                    chat
                                </h2>

                                <p>
                                    Choose a
                                    conversation
                                    to start
                                    messaging.
                                </p>
                            </div>
                        ) : (
                            <>
                                <header className="chats-page__conversation-header">
                                    <div>
                                        <strong>
                                            {getChatTitle(
                                                selectedChat,
                                            )}
                                        </strong>

                                        <span>
                                            {getChatType(
                                                selectedChat,
                                            )}
                                        </span>
                                    </div>
                                </header>

                                <div className="chats-page__messages">
                                    {isMessagesLoading ? (
                                        <p className="chats-page__messages-loading">
                                            Loading
                                            messages...
                                        </p>
                                    ) : messages.length ===
                                        0 ? (
                                        <p className="chats-page__messages-loading">
                                            No
                                            messages
                                            yet.
                                        </p>
                                    ) : (
                                        messages.map(
                                            (
                                                message,
                                            ) => (
                                                <div
                                                    key={
                                                        message.id
                                                    }
                                                    className={`chats-page__message ${message.isSystem
                                                        ? 'is-system'
                                                        : ''
                                                        }`}
                                                >
                                                    <div className="chats-page__message-author">
                                                        {message.sender?.name ||
                                                            'StepOut'}
                                                    </div>

                                                    <p>
                                                        {
                                                            message.text
                                                        }
                                                    </p>

                                                    <time>
                                                        {new Date(
                                                            message.createdAt,
                                                        ).toLocaleTimeString(
                                                            'en-US',
                                                            {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            },
                                                        )}
                                                    </time>
                                                </div>
                                            ),
                                        )
                                    )}
                                </div>

                                {selectedChat.type !==
                                    'admin' && (
                                        <form
                                            className="chats-page__composer"
                                            onSubmit={
                                                handleSend
                                            }
                                        >
                                            <input
                                                type="text"
                                                value={
                                                    messageText
                                                }
                                                onChange={(
                                                    event,
                                                ) =>
                                                    setMessageText(
                                                        event
                                                            .target
                                                            .value,
                                                    )
                                                }
                                                placeholder="Write a message..."
                                                maxLength={
                                                    2000
                                                }
                                            />

                                            <button
                                                type="submit"
                                                disabled={
                                                    isSending ||
                                                    !messageText.trim()
                                                }
                                            >
                                                <Send
                                                    size={
                                                        17
                                                    }
                                                />
                                            </button>
                                        </form>
                                    )}
                            </>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Chats;