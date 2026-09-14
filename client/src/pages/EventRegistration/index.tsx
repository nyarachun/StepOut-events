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

    const [cardNumber, setCardNumber] =
        useState('');

    const [cardholderName, setCardholderName] =
        useState('');

    const [expiry, setExpiry] =
        useState('');

    const [cvv, setCvv] =
        useState('');

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

            if (Number(event.price) > 0) {
                const normalizedCard = cardNumber.replace(/\s/g, '');

                if (
                    !/^\d{16}$/.test(normalizedCard) ||
                    !/^\d{2}\/\d{2}$/.test(expiry) ||
                    !/^\d{3,4}$/.test(cvv) ||
                    cardholderName.trim().length < 2
                ) {
                    setError(
                        'Enter valid mock payment details to continue.',
                    );

                    return;
                }
            }

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

                        {Number(event.price) > 0 && (
                            <div className="event-registration__payment">
                                <div className="event-registration__payment-heading">
                                    <span>MOCK PAYMENT</span>
                                    <small>No real charge will be made</small>
                                </div>

                                <label>
                                    Cardholder name
                                    <input
                                        value={cardholderName}
                                        onChange={(currentEvent) =>
                                            setCardholderName(currentEvent.target.value)
                                        }
                                        placeholder="Alex Morgan"
                                        autoComplete="cc-name"
                                    />
                                </label>

                                <label>
                                    Card number
                                    <input
                                        value={cardNumber}
                                        onChange={(currentEvent) =>
                                            setCardNumber(
                                                currentEvent.target.value
                                                    .replace(/\D/g, '')
                                                    .slice(0, 16)
                                                    .replace(/(.{4})/g, '$1 ')
                                                    .trim(),
                                            )
                                        }
                                        placeholder="4242 4242 4242 4242"
                                        inputMode="numeric"
                                        autoComplete="cc-number"
                                    />
                                </label>

                                <div className="event-registration__payment-row">
                                    <label>
                                        Expiry
                                        <input
                                            value={expiry}
                                            onChange={(currentEvent) =>
                                                setExpiry(
                                                    currentEvent.target.value
                                                        .replace(/\D/g, '')
                                                        .slice(0, 4)
                                                        .replace(/^(\d{2})(\d)/, '$1/$2'),
                                                )
                                            }
                                            placeholder="MM/YY"
                                            inputMode="numeric"
                                            autoComplete="cc-exp"
                                        />
                                    </label>

                                    <label>
                                        CVV
                                        <input
                                            value={cvv}
                                            onChange={(currentEvent) =>
                                                setCvv(
                                                    currentEvent.target.value
                                                        .replace(/\D/g, '')
                                                        .slice(0, 4),
                                                )
                                            }
                                            placeholder="123"
                                            inputMode="numeric"
                                            autoComplete="cc-csc"
                                        />
                                    </label>
                                </div>
                            </div>
                        )}

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
                                    <Check size={18} />
                                    {Number(event.price) > 0
                                        ? 'Pay and register'
                                        : 'Confirm registration'}
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