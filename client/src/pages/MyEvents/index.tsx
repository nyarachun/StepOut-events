import axios from 'axios';
import {
    CalendarDays,
    ChevronRight,
    Edit3,
    MapPin,
    Plus,
    Trash2,
    XCircle,
} from 'lucide-react';
import {
    useEffect,
    useState,
} from 'react';
import {
    Link,
} from 'react-router-dom';

import { api } from '../../api/api';
import {
    deleteEvent,
    type EventItem,
} from '../../api/events';
import {
    cancelRegistration,
    type Registration,
    getMyRegistrations,
} from '../../api/registrations';

import './MyEvents.scss';

type UserRole =
    | 'user'
    | 'organizer'
    | 'admin';

const MyEvents = () => {
    const [events, setEvents] =
        useState<EventItem[]>([]);

    const [registrations, setRegistrations] =
        useState<Registration[]>([]);

    const [role, setRole] =
        useState<UserRole>('user');

    const [isLoading, setIsLoading] =
        useState(true);

    const [deletingId, setDeletingId] =
        useState<number | null>(null);

    const [
        cancellingId,
        setCancellingId,
    ] = useState<number | null>(null);

    const [error, setError] =
        useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const profileResponse =
                    await api.get<{
                        role: UserRole;
                    }>('/users/me');

                const currentRole =
                    profileResponse.data
                        .role;

                setRole(currentRole);

                if (
                    currentRole ===
                    'organizer'
                ) {
                    const response =
                        await api.get<
                            EventItem[]
                        >(
                            '/events/my',
                        );

                    setEvents(
                        response.data,
                    );
                } else {
                    const response =
                        await getMyRegistrations();

                    setRegistrations(
                        response,
                    );
                }
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
                        Array.isArray(
                            message,
                        )
                            ? message.join(
                                  ', ',
                              )
                            : message ||
                                  'Could not load your events.',
                    );
                } else {
                    setError(
                        'Could not load your events.',
                    );
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleDelete = async (
        eventId: number,
    ) => {
        const confirmed =
            window.confirm(
                'Are you sure you want to delete this event?',
            );

        if (!confirmed) {
            return;
        }

        setError('');
        setDeletingId(eventId);

        try {
            await deleteEvent(
                eventId,
            );

            setEvents(
                (currentEvents) =>
                    currentEvents.filter(
                        (event) =>
                            event.id !==
                            eventId,
                    ),
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

                setError(
                    Array.isArray(message)
                        ? message.join(
                              ', ',
                          )
                        : message ||
                          'Could not delete event.',
                );
            } else {
                setError(
                    'Could not delete event.',
                );
            }
        } finally {
            setDeletingId(null);
        }
    };

    const handleCancelRegistration =
        async (
            registrationId: number,
        ) => {
            const confirmed =
                window.confirm(
                    'Are you sure you want to cancel your registration?',
                );

            if (!confirmed) {
                return;
            }

            setError('');
            setCancellingId(
                registrationId,
            );

            try {
                await cancelRegistration(
                    registrationId,
                );

                setRegistrations(
                    (currentRegistrations) =>
                        currentRegistrations.filter(
                            (
                                registration,
                            ) =>
                                registration.id !==
                                registrationId,
                        ),
                );
            } catch (requestError) {
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
                              'Could not cancel registration.',
                    );
                } else {
                    setError(
                        'Could not cancel registration.',
                    );
                }
            } finally {
                setCancellingId(
                    null,
                );
            }
        };

    if (isLoading) {
        return (
            <main className="my-events">
                <div className="my-events__container">
                    <p>
                        Loading your events...
                    </p>
                </div>
            </main>
        );
    }

    const isOrganizer =
        role === 'organizer';

    return (
        <main className="my-events">
            <div className="my-events__container">
                <header className="my-events__header">
                    <div>
                        <span className="my-events__eyebrow">
                            {isOrganizer
                                ? 'ORGANIZER'
                                : 'YOUR SCHEDULE'}
                        </span>

                        <h1>
                            My events
                        </h1>

                        <p>
                            {isOrganizer
                                ? 'Manage the events you created.'
                                : 'Events you are registered for.'}
                        </p>
                    </div>

                    {isOrganizer && (
                        <Link
                            className="my-events__create"
                            to="/events/create"
                        >
                            <Plus
                                size={18}
                            />
                            Create event
                        </Link>
                    )}
                </header>

                {error && (
                    <p className="my-events__error">
                        {error}
                    </p>
                )}

                {isOrganizer ? (
                    <>
                        {events.length ===
                            0 && (
                            <div className="my-events__empty">
                                <h2>
                                    No events
                                    yet
                                </h2>

                                <p>
                                    Create your
                                    first event
                                    and invite
                                    people to
                                    join.
                                </p>

                                <Link
                                    to="/events/create"
                                    className="my-events__empty-link"
                                >
                                    Create your
                                    first event
                                </Link>
                            </div>
                        )}

                        {events.length >
                            0 && (
                            <div className="my-events__list">
                                {events.map(
                                    (
                                        event,
                                    ) => {
                                        const date =
                                            new Date(
                                                event.date,
                                            );

                                        return (
                                            <article
                                                key={
                                                    event.id
                                                }
                                                className="my-events__card"
                                            >
                                                <Link
                                                    to={`/events/${event.id}`}
                                                    className="my-events__card-link"
                                                >
                                                    <div className="my-events__image">
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
                                                                No
                                                                image
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="my-events__content">
                                                        <div className="my-events__card-top">
                                                            <span>
                                                                {
                                                                    event
                                                                        .category
                                                                        ?.name
                                                                }
                                                            </span>

                                                            <ChevronRight
                                                                size={
                                                                    19
                                                                }
                                                            />
                                                        </div>

                                                        <h2>
                                                            {
                                                                event.title
                                                            }
                                                        </h2>

                                                        <p>
                                                            {
                                                                event.description
                                                            }
                                                        </p>

                                                        <div className="my-events__meta">
                                                            <span>
                                                                <CalendarDays
                                                                    size={
                                                                        15
                                                                    }
                                                                />

                                                                {date.toLocaleDateString(
                                                                    'en-US',
                                                                    {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                    },
                                                                )}
                                                            </span>

                                                            <span>
                                                                <MapPin
                                                                    size={
                                                                        15
                                                                    }
                                                                />

                                                                {
                                                                    event.address
                                                                }
                                                            </span>
                                                        </div>

                                                        <div className="my-events__bottom">
                                                            <span>
                                                                {Number(
                                                                    event.price,
                                                                ) ===
                                                                0
                                                                    ? 'Free'
                                                                    : `${event.price} UAH`}
                                                            </span>

                                                            <span>
                                                                {event.availableSpots ??
                                                                    event.capacity}{' '}
                                                                spots
                                                                left
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>

                                                <div className="my-events__actions">
                                                    <Link
                                                        to={`/events/${event.id}/edit`}
                                                        className="my-events__edit"
                                                    >
                                                        <Edit3
                                                            size={
                                                                15
                                                            }
                                                        />
                                                        Edit
                                                    </Link>

                                                    <button
                                                        className="my-events__delete"
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                event.id,
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            event.id
                                                        }
                                                    >
                                                        <Trash2
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        {deletingId ===
                                                        event.id
                                                            ? 'Deleting...'
                                                            : 'Delete'}
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    },
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {registrations.length ===
                            0 && (
                            <div className="my-events__empty">
                                <h2>
                                    No registered
                                    events
                                </h2>

                                <p>
                                    Find an event
                                    you like and
                                    register for
                                    it.
                                </p>

                                <Link
                                    to="/events"
                                    className="my-events__empty-link"
                                >
                                    Explore events
                                </Link>
                            </div>
                        )}

                        {registrations.length >
                            0 && (
                            <div className="my-events__list">
                                {registrations.map(
                                    (
                                        registration,
                                    ) => {
                                        const event =
                                            registration.event;

                                        const date =
                                            new Date(
                                                event.date,
                                            );

                                        return (
                                            <article
                                                key={
                                                    registration.id
                                                }
                                                className="my-events__card"
                                            >
                                                <Link
                                                    to={`/events/${event.id}`}
                                                    className="my-events__card-link"
                                                >
                                                    <div className="my-events__image">
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
                                                                No
                                                                image
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="my-events__content">
                                                        <div className="my-events__card-top">
                                                            <span>
                                                                REGISTERED
                                                            </span>

                                                            <ChevronRight
                                                                size={
                                                                    19
                                                                }
                                                            />
                                                        </div>

                                                        <h2>
                                                            {
                                                                event.title
                                                            }
                                                        </h2>

                                                        <p>
                                                            {
                                                                event.description
                                                            }
                                                        </p>

                                                        <div className="my-events__meta">
                                                            <span>
                                                                <CalendarDays
                                                                    size={
                                                                        15
                                                                    }
                                                                />

                                                                {date.toLocaleDateString(
                                                                    'en-US',
                                                                    {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                    },
                                                                )}
                                                            </span>

                                                            <span>
                                                                <MapPin
                                                                    size={
                                                                        15
                                                                    }
                                                                />

                                                                {
                                                                    event.address
                                                                }
                                                            </span>
                                                        </div>

                                                        <div className="my-events__bottom">
                                                            <span>
                                                                {Number(
                                                                    event.price,
                                                                ) ===
                                                                0
                                                                    ? 'Free'
                                                                    : `${event.price} UAH`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>

                                                <div className="my-events__actions">
                                                    <button
                                                        className="my-events__cancel"
                                                        type="button"
                                                        onClick={() =>
                                                            handleCancelRegistration(
                                                                registration.id,
                                                            )
                                                        }
                                                        disabled={
                                                            cancellingId ===
                                                            registration.id
                                                        }
                                                    >
                                                        <XCircle
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        {cancellingId ===
                                                        registration.id
                                                            ? 'Cancelling...'
                                                            : 'Cancel registration'}
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    },
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
};

export default MyEvents;