import axios from 'axios';
import {
    Ban,
    CalendarDays,
    MapPin,
    X,
} from 'lucide-react';
import {
    useEffect,
    useState,
} from 'react';

import {
    banEvent,
    getAdminEvents,
} from '../../api/admin';
import type { EventItem } from '../../api/events';
import { useAuth } from '../../context/AuthContext';

import './Admin.scss';

const Admin = () => {
    const { user } = useAuth();

    const [events, setEvents] =
        useState<EventItem[]>([]);

    const [selectedEvent, setSelectedEvent] =
        useState<EventItem | null>(null);

    const [reason, setReason] =
        useState('');

    const [isLoading, setIsLoading] =
        useState(true);

    const [isBanning, setIsBanning] =
        useState(false);

    const [error, setError] =
        useState('');

    const [success, setSuccess] =
        useState('');

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data =
                    await getAdminEvents();

                setEvents(data);
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
                            'Could not load events.',
                    );
                } else {
                    setError(
                        'Could not load events.',
                    );
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (
            user?.role === 'admin'
        ) {
            void loadEvents();
        }
    }, [user]);

    const openBanModal = (
        event: EventItem,
    ) => {
        setSelectedEvent(event);
        setReason('');
        setError('');
        setSuccess('');
    };

    const closeBanModal = () => {
        if (isBanning) {
            return;
        }

        setSelectedEvent(null);
        setReason('');
    };

    const handleBan = async () => {
        if (!selectedEvent) {
            return;
        }

        const trimmedReason =
            reason.trim();

        if (trimmedReason.length < 5) {
            setError(
                'Please provide a reason of at least 5 characters.',
            );

            return;
        }

        setIsBanning(true);
        setError('');
        setSuccess('');

        try {
            await banEvent(
                selectedEvent.id,
                {
                    reason:
                        trimmedReason,
                },
            );

            setEvents(
                (currentEvents) =>
                    currentEvents.filter(
                        (event) =>
                            event.id !==
                            selectedEvent.id,
                    ),
            );

            setSelectedEvent(null);
            setReason('');

            setSuccess(
                `Event "${selectedEvent.title}" was banned successfully.`,
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
                        'Could not ban event.',
                );
            } else {
                setError(
                    'Could not ban event.',
                );
            }
        } finally {
            setIsBanning(false);
        }
    };

    if (user?.role !== 'admin') {
        return (
            <main className="admin-page">
                <div className="admin-page__container">
                    <div className="admin-page__empty">
                        <h1>
                            Access denied
                        </h1>

                        <p>
                            This page is
                            available only
                            for administrators.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (isLoading) {
        return (
            <main className="admin-page">
                <div className="admin-page__loading">
                    Loading events...
                </div>
            </main>
        );
    }

    return (
        <main className="admin-page">
            <div className="admin-page__container">
                <header className="admin-page__header">
                    <div>
                        <span>
                            ADMINISTRATION
                        </span>

                        <h1>
                            Event moderation
                        </h1>

                        <p>
                            Review published
                            events and remove
                            those that violate
                            the platform rules.
                        </p>
                    </div>

                    <div className="admin-page__count">
                        <strong>
                            {events.length}
                        </strong>

                        <span>
                            active events
                        </span>
                    </div>
                </header>

                {error && (
                    <p className="admin-page__error">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="admin-page__success">
                        {success}
                    </p>
                )}

                {events.length === 0 ? (
                    <div className="admin-page__empty">
                        <Ban size={30} />

                        <h2>
                            No events to
                            moderate
                        </h2>

                        <p>
                            There are currently
                            no active events.
                        </p>
                    </div>
                ) : (
                    <div className="admin-page__list">
                        {events.map(
                            (event) => {
                                const date =
                                    new Date(
                                        event.date,
                                    );

                                return (
                                    <article
                                        key={
                                            event.id
                                        }
                                        className="admin-page__card"
                                    >
                                        <div className="admin-page__image">
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

                                        <div className="admin-page__content">
                                            <div className="admin-page__category">
                                                {
                                                    event
                                                        .category
                                                        ?.name
                                                }
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

                                            <div className="admin-page__meta">
                                                <span>
                                                    <CalendarDays
                                                        size={
                                                            14
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
                                                            14
                                                        }
                                                    />

                                                    {
                                                        event.address
                                                    }
                                                </span>
                                            </div>

                                            <div className="admin-page__organizer">
                                                Organizer:{' '}
                                                <strong>
                                                    {
                                                        event
                                                            .organizer
                                                            ?.name
                                                    }
                                                </strong>
                                            </div>

                                            <button
                                                className="admin-page__ban"
                                                type="button"
                                                onClick={() =>
                                                    openBanModal(
                                                        event,
                                                    )
                                                }
                                            >
                                                <Ban
                                                    size={
                                                        15
                                                    }
                                                />
                                                Ban event
                                            </button>
                                        </div>
                                    </article>
                                );
                            },
                        )}
                    </div>
                )}

                {selectedEvent && (
                    <div className="admin-page__modal-overlay">
                        <div
                            className="admin-page__modal"
                            role="dialog"
                            aria-modal="true"
                        >
                            <button
                                className="admin-page__modal-close"
                                type="button"
                                onClick={
                                    closeBanModal
                                }
                                disabled={
                                    isBanning
                                }
                                aria-label="Close"
                            >
                                <X
                                    size={
                                        19
                                    }
                                />
                            </button>

                            <span className="admin-page__modal-eyebrow">
                                MODERATION
                            </span>

                            <h2>
                                Ban event
                            </h2>

                            <p>
                                The event will
                                be permanently
                                removed from the
                                platform and the
                                organizer will
                                receive your
                                reason.
                            </p>

                            <div className="admin-page__selected-event">
                                {
                                    selectedEvent.title
                                }
                            </div>

                            <label htmlFor="ban-reason">
                                Reason
                            </label>

                            <textarea
                                id="ban-reason"
                                value={reason}
                                onChange={(
                                    event,
                                ) =>
                                    setReason(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                placeholder="Explain why this event is being removed..."
                                maxLength={500}
                                rows={5}
                                disabled={
                                    isBanning
                                }
                            />

                            <div className="admin-page__modal-actions">
                                <button
                                    className="admin-page__cancel"
                                    type="button"
                                    onClick={
                                        closeBanModal
                                    }
                                    disabled={
                                        isBanning
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    className="admin-page__confirm-ban"
                                    type="button"
                                    onClick={
                                        handleBan
                                    }
                                    disabled={
                                        isBanning ||
                                        reason.trim()
                                            .length <
                                        5
                                    }
                                >
                                    <Ban
                                        size={
                                            15
                                        }
                                    />

                                    {isBanning
                                        ? 'Banning...'
                                        : 'Confirm ban'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Admin;