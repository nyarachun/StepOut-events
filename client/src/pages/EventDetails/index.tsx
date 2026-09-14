import axios from 'axios';
import {
    ArrowLeft,
    Ban,
    CalendarDays,
    MapPin,
    MessageCircle,
    Users,
} from 'lucide-react';
import {
    useEffect,
    useState,
} from 'react';
import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom';

import { api } from '../../api/api';
import { banEvent } from '../../api/admin';
import {
    createEventChat,
} from '../../api/chats';
import {
    getMyRegistration,
} from '../../api/registrations';
import { useAuth } from '../../context/AuthContext';

import './EventDetails.scss';

type EventDetailsData = {
    id: number;
    title: string;
    description: string;
    date: string;
    address: string;
    price: number;
    capacity: number;
    imageUrl: string | null;
    registeredCount: number;
    availableSpots: number;
    organizer: {
        id: number;
        name: string;
    };
    category: {
        id: number;
        name: string;
    };
    city: {
        id: number;
        name: string;
    };
};

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        isAuthenticated,
        user,
    } = useAuth();

    const [event, setEvent] =
        useState<EventDetailsData | null>(
            null,
        );

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        isRegistered,
        setIsRegistered,
    ] = useState(false);

    const [
        isCheckingRegistration,
        setIsCheckingRegistration,
    ] = useState(false);

    const [question, setQuestion] =
        useState('');

    const [
        isQuestionSending,
        setIsQuestionSending,
    ] = useState(false);

    const [
        questionError,
        setQuestionError,
    ] = useState('');

    const [error, setError] =
        useState('');

    const [isBanModalOpen, setIsBanModalOpen] =
        useState(false);

    const [banReason, setBanReason] =
        useState('');

    const [isBanning, setIsBanning] =
        useState(false);

    const [banError, setBanError] =
        useState('');

    useEffect(() => {
        const loadEvent = async () => {
            if (!id) {
                return;
            }

            setIsLoading(true);
            setError('');

            try {
                const response =
                    await api.get<EventDetailsData>(
                        `/events/${id}`,
                    );

                setEvent(response.data);
            } catch (requestError) {
                if (
                    axios.isAxiosError(
                        requestError,
                    )
                ) {
                    const message =
                        requestError.response
                            ?.data?.message;

                    setError(
                        Array.isArray(message)
                            ? message.join(
                                ', ',
                            )
                            : message ||
                            'Could not load event.',
                    );
                } else {
                    setError(
                        'Could not load event.',
                    );
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadEvent();
    }, [id]);

    useEffect(() => {
        const checkRegistration =
            async () => {
                if (
                    !event ||
                    !isAuthenticated
                ) {
                    setIsRegistered(false);

                    return;
                }

                setIsCheckingRegistration(
                    true,
                );

                try {
                    await getMyRegistration(
                        event.id,
                    );

                    setIsRegistered(true);
                } catch {
                    setIsRegistered(false);
                } finally {
                    setIsCheckingRegistration(
                        false,
                    );
                }
            };

        void checkRegistration();
    }, [
        event,
        isAuthenticated,
    ]);

    const isOwnEvent =
        Boolean(
            user &&
            event &&
            user.id ===
            event.organizer.id,
        );

    const handleRegisterClick =
        () => {
            if (!event) {
                return;
            }

            if (!isAuthenticated) {
                navigate('/login');

                return;
            }

            if (isOwnEvent) {
                return;
            }

            if (isRegistered) {
                navigate('/my-events');

                return;
            }

            if (
                event.availableSpots <=
                0
            ) {
                return;
            }

            navigate(
                `/events/${event.id}/register`,
            );
        };

    const handleAskOrganizer =
        async () => {
            if (!event) {
                return;
            }

            if (!isAuthenticated) {
                navigate('/login');

                return;
            }

            if (isOwnEvent) {
                return;
            }

            const text =
                question.trim();

            if (!text) {
                setQuestionError(
                    'Write your question first.',
                );

                return;
            }

            setQuestionError('');
            setIsQuestionSending(true);

            try {
                const chat =
                    await createEventChat(
                        event.id,
                        text,
                    );

                navigate(
                    `/messages?chat=${chat.id}`,
                );
            } catch (requestError) {
                if (
                    axios.isAxiosError(
                        requestError,
                    )
                ) {
                    const message =
                        requestError.response
                            ?.data?.message;

                    setQuestionError(
                        Array.isArray(message)
                            ? message.join(
                                ', ',
                            )
                            : message ||
                            'Could not send your question.',
                    );
                } else {
                    setQuestionError(
                        'Could not send your question.',
                    );
                }
            } finally {
                setIsQuestionSending(
                    false,
                );
            }
        };

    const handleBan = async () => {
        if (!event || user?.role !== 'admin') {
            return;
        }

        const reason = banReason.trim();

        if (reason.length < 5) {
            setBanError('Enter a reason of at least 5 characters.');

            return;
        }

        setIsBanning(true);
        setBanError('');

        try {
            await banEvent(event.id, { reason });
            navigate('/events', { replace: true });
        } catch (requestError) {
            if (axios.isAxiosError(requestError)) {
                const message = requestError.response?.data?.message;

                setBanError(
                    Array.isArray(message)
                        ? message.join(', ')
                        : message || 'Could not ban this event.',
                );
            } else {
                setBanError('Could not ban this event.');
            }
        } finally {
            setIsBanning(false);
        }
    };

    if (isLoading) {
        return (
            <main className="event-details">
                <div className="event-details__loading">
                    Loading event...
                </div>
            </main>
        );
    }

    if (!event) {
        return (
            <main className="event-details">
                <div className="event-details__container">
                    <p className="event-details__error">
                        {error ||
                            'Event not found.'}
                    </p>

                    <Link
                        to="/events"
                        className="event-details__back"
                    >
                        <ArrowLeft
                            size={17}
                        />
                        Back to events
                    </Link>
                </div>
            </main>
        );
    }

    const eventDate =
        new Date(event.date);

    const isSoldOut =
        event.availableSpots <= 0;

    return (
        <main className="event-details">
            <div className="event-details__container">
                <Link
                    to="/events"
                    className="event-details__back"
                >
                    <ArrowLeft
                        size={17}
                    />
                    Back to events
                </Link>

                <article className="event-details__card">
                    <div className="event-details__image">
                        {event.imageUrl ? (
                            <img
                                src={
                                    event.imageUrl
                                }
                                alt={
                                    event.title
                                }
                            />
                        ) : (
                            <div className="event-details__no-image">
                                No image
                            </div>
                        )}

                    </div>

                    <div className="event-details__content">
                        <div className="event-details__top">
                            <span className="event-details__category">
                                {
                                    event
                                        .category
                                        .name
                                }
                            </span>

                            <span className="event-details__city">
                                {
                                    event.city
                                        .name
                                }
                            </span>
                        </div>

                        <h1 className="event-details__title">
                            {event.title}
                        </h1>

                        <p className="event-details__description">
                            {
                                event.description
                            }
                        </p>

                        <div className="event-details__info">
                            <div className="event-details__info-item">
                                <CalendarDays
                                    size={19}
                                />

                                <div>
                                    <span>
                                        Date
                                    </span>

                                    <strong>
                                        {eventDate.toLocaleDateString(
                                            'en-US',
                                            {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            },
                                        )}

                                        {' · '}

                                        {eventDate.toLocaleTimeString(
                                            'en-US',
                                            {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            },
                                        )}
                                    </strong>
                                </div>
                            </div>

                            <div className="event-details__info-item">
                                <MapPin
                                    size={19}
                                />

                                <div>
                                    <span>
                                        Location
                                    </span>

                                    <strong>
                                        {
                                            event.address
                                        }
                                    </strong>
                                </div>
                            </div>

                            <div className="event-details__info-item">
                                <Users
                                    size={19}
                                />

                                <div>
                                    <span>
                                        Availability
                                    </span>

                                    <strong>
                                        {
                                            event.availableSpots
                                        }{' '}
                                        of{' '}
                                        {
                                            event.capacity
                                        }{' '}
                                        spots
                                        available
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="event-details__organizer">
                            <div className="event-details__organizer-avatar">
                                {event
                                    .organizer
                                    .name
                                    .charAt(
                                        0,
                                    )
                                    .toUpperCase()}
                            </div>

                            <div>
                                <span>
                                    Organized
                                    by
                                </span>

                                <strong>
                                    {
                                        event
                                            .organizer
                                            .name
                                    }
                                </strong>
                            </div>
                        </div>

                        {error && (
                            <p className="event-details__error">
                                {error}
                            </p>
                        )}

                        <div className="event-details__actions">
                            <div className="event-details__price">
                                <span>
                                    Price
                                </span>

                                <strong>
                                    {Number(
                                        event.price,
                                    ) ===
                                        0
                                        ? 'Free'
                                        : `${event.price} UAH`}
                                </strong>
                            </div>

                            {!isOwnEvent && (
                                <button
                                    className="event-details__register-button"
                                    type="button"
                                    onClick={
                                        handleRegisterClick
                                    }
                                    disabled={
                                        isCheckingRegistration ||
                                        isSoldOut
                                    }
                                >
                                    {isCheckingRegistration
                                        ? 'Checking...'
                                        : isRegistered
                                            ? 'Already registered'
                                            : isSoldOut
                                                ? 'Event is full'
                                                : 'Register for event'}
                                </button>
                            )}
                        </div>

                        {user?.role === 'admin' && (
                            <button
                                className="event-details__ban-button"
                                type="button"
                                onClick={() => {
                                    setBanReason('');
                                    setBanError('');
                                    setIsBanModalOpen(true);
                                }}
                            >
                                <Ban size={17} />
                                Ban event
                            </button>
                        )}

                        {!isOwnEvent && (
                            <div className="event-details__question">
                                <div className="event-details__question-heading">
                                    <MessageCircle
                                        size={20}
                                    />

                                    <div>
                                        <h2>
                                            Have a
                                            question?
                                        </h2>

                                        <p>
                                            Ask the
                                            organizer
                                            directly
                                            about this
                                            event.
                                        </p>
                                    </div>
                                </div>

                                <textarea
                                    value={
                                        question
                                    }
                                    onChange={(
                                        currentEvent,
                                    ) =>
                                        setQuestion(
                                            currentEvent
                                                .target
                                                .value,
                                        )
                                    }
                                    placeholder="Write your question..."
                                    maxLength={
                                        2000
                                    }
                                    rows={4}
                                />

                                {questionError && (
                                    <p className="event-details__question-error">
                                        {
                                            questionError
                                        }
                                    </p>
                                )}

                                <button
                                    className="event-details__question-button"
                                    type="button"
                                    onClick={
                                        handleAskOrganizer
                                    }
                                    disabled={
                                        isQuestionSending ||
                                        !question.trim()
                                    }
                                >
                                    {isQuestionSending
                                        ? 'Sending...'
                                        : 'Ask organizer'}
                                </button>
                            </div>
                        )}
                    </div>
                </article>

                {isBanModalOpen && (
                    <div className="event-details__modal-overlay">
                        <div
                            className="event-details__modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="ban-event-title"
                        >
                            <span className="event-details__modal-eyebrow">
                                ADMIN MODERATION
                            </span>

                            <h2 id="ban-event-title">
                                Are you sure you want to ban this event?
                            </h2>

                            <p>
                                The event will be removed and the reason will be sent automatically to the organizer.
                            </p>

                            <label className="event-details__modal-label">
                                Reason
                                <textarea
                                    value={banReason}
                                    onChange={(currentEvent) =>
                                        setBanReason(currentEvent.target.value)
                                    }
                                    placeholder="Explain why this event violates the rules..."
                                    rows={5}
                                    maxLength={1000}
                                />
                            </label>

                            {banError && (
                                <p className="event-details__ban-error">
                                    {banError}
                                </p>
                            )}

                            <div className="event-details__modal-actions">
                                <button
                                    type="button"
                                    className="event-details__modal-cancel"
                                    onClick={() => setIsBanModalOpen(false)}
                                    disabled={isBanning}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="event-details__modal-confirm"
                                    onClick={() => void handleBan()}
                                    disabled={isBanning}
                                >
                                    {isBanning ? 'Banning...' : 'Yes, ban event'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default EventDetails;