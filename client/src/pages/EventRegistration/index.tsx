import axios from 'axios';
import {
    ArrowLeft,
    CalendarDays,
    Check,
    MapPin,
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
import {
    registerForEvent,
} from '../../api/registrations';

import './EventRegistration.scss';

type EventData = {
    id: number;
    title: string;
    description: string;
    date: string;
    address: string;
    price: number;
    capacity: number;
    imageUrl: string | null;
    registeredCount?: number;
    availableSpots?: number;
};

const EventRegistration = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [
        event,
        setEvent,
    ] = useState<EventData | null>(
        null,
    );

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        isRegistering,
        setIsRegistering,
    ] = useState(false);

    const [error, setError] =
        useState('');

    useEffect(() => {
        const loadEvent =
            async () => {
                if (!id) {
                    return;
                }

                try {
                    const response =
                        await api.get<EventData>(
                            `/events/${id}`,
                        );

                    setEvent(
                        response.data,
                    );
                } catch {
                    setError(
                        'Could not load event.',
                    );
                } finally {
                    setIsLoading(
                        false,
                    );
                }
            };

        loadEvent();
    }, [id]);

    const handleRegister =
        async () => {
            if (!event) {
                return;
            }

            setError('');
            setIsRegistering(true);

            try {
                await registerForEvent(
                    event.id,
                );

                navigate(
                    '/my-events',
                    {
                        replace: true,
                    },
                );
            } catch (
                requestError
            ) {
                if (
                    axios.isAxiosError(
                        requestError,
                    )
                ) {
                    const message =
                        requestError
                            .response
                            ?.data?.message;

                    setError(
                        Array.isArray(
                            message,
                        )
                            ? message.join(
                                  ', ',
                              )
                            : message ||
                              'Could not register for this event.',
                    );
                } else {
                    setError(
                        'Could not register for this event.',
                    );
                }
            } finally {
                setIsRegistering(
                    false,
                );
            }
        };

    if (isLoading) {
        return (
            <main className="event-registration">
                <div className="event-registration__loading">
                    Loading event...
                </div>
            </main>
        );
    }

    if (!event) {
        return (
            <main className="event-registration">
                <div className="event-registration__container">
                    <p className="event-registration__error">
                        {error ||
                            'Event not found.'}
                    </p>

                    <Link
                        to="/events"
                        className="event-registration__back"
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

    const availableSpots =
        event.availableSpots ??
        event.capacity -
            (event.registeredCount ??
                0);

    const isSoldOut =
        availableSpots <= 0;

    return (
        <main className="event-registration">
            <div className="event-registration__container">
                <Link
                    to={`/events/${event.id}`}
                    className="event-registration__back"
                >
                    <ArrowLeft
                        size={17}
                    />
                    Back to event
                </Link>

                <div className="event-registration__card">
                    <div className="event-registration__image">
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
                            <div>
                                No image
                            </div>
                        )}
                    </div>

                    <div className="event-registration__content">
                        <span className="event-registration__eyebrow">
                            EVENT REGISTRATION
                        </span>

                        <h1>
                            {event.title}
                        </h1>

                        <p className="event-registration__description">
                            {event.description}
                        </p>

                        <div className="event-registration__info">
                            <div>
                                <CalendarDays
                                    size={18}
                                />

                                <span>
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
                                </span>
                            </div>

                            <div>
                                <MapPin
                                    size={18}
                                />

                                <span>
                                    {
                                        event.address
                                    }
                                </span>
                            </div>

                            <div>
                                <Users
                                    size={18}
                                />

                                <span>
                                    {availableSpots}{' '}
                                    spots
                                    available
                                </span>
                            </div>
                        </div>

                        <div className="event-registration__price">
                            {Number(
                                event.price,
                            ) === 0
                                ? 'Free'
                                : `${event.price} UAH`}
                        </div>

                        {error && (
                            <p className="event-registration__error">
                                {error}
                            </p>
                        )}

                        <button
                            className="event-registration__submit"
                            type="button"
                            onClick={
                                handleRegister
                            }
                            disabled={
                                isRegistering ||
                                isSoldOut
                            }
                        >
                            {isRegistering ? (
                                'Registering...'
                            ) : isSoldOut ? (
                                'Event is full'
                            ) : (
                                <>
                                    <Check
                                        size={18}
                                    />
                                    Confirm
                                    registration
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EventRegistration;