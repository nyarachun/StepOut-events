import {
    CircleHelp,
} from 'lucide-react';
import {
    useEffect,
    useRef,
    useState,
} from 'react';

import { getEvents } from '../../api/events';
import { useCity } from '../../context/CityContext';
import {
    EventCard,
    type EventCardData,
} from '../EventCard/EventCard';

import './EventRoulette.scss';

export const EventRoulette = () => {
    const { selectedCity } = useCity();
    const [budget, setBudget] = useState(1000);
    const [events, setEvents] = useState<EventCardData[]>(
        [],
    );
    const [selectedEvent, setSelectedEvent] =
        useState<EventCardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRolling, setIsRolling] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const rollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const cityId = selectedCity?.id;

        if (!cityId) {
            return () => {
                if (rollingTimeoutRef.current) {
                    clearTimeout(rollingTimeoutRef.current);
                }
            };
        }

        let isCurrentRequest = true;

        const loadEvents = async () => {
            setIsLoading(true);
            setLoadError(false);
            setSelectedEvent(null);
            setIsRolling(false);

            try {
                const data = await getEvents({ cityId });

                if (isCurrentRequest) {
                    setEvents(data);
                }
            } catch (error) {
                if (isCurrentRequest) {
                    setEvents([]);
                    setLoadError(true);
                }

                console.error(
                    'Failed to load events',
                    error,
                );
            } finally {
                if (isCurrentRequest) {
                    setIsLoading(false);
                }
            }
        };

        loadEvents();

        return () => {
            isCurrentRequest = false;

            if (rollingTimeoutRef.current) {
                clearTimeout(rollingTimeoutRef.current);
                rollingTimeoutRef.current = null;
            }
        };
    }, [selectedCity?.id]);

    const handleRoulette = () => {
        if (isRolling) {
            return;
        }

        const availableEvents = events.filter(
            (event) =>
                event.cityId === selectedCity?.id &&
                event.price <= budget,
        );

        setIsRolling(true);
        setSelectedEvent(null);

        rollingTimeoutRef.current = setTimeout(() => {
            if (availableEvents.length === 0) {
                setIsRolling(false);
                rollingTimeoutRef.current = null;

                return;
            }

            const randomIndex = Math.floor(
                Math.random() * availableEvents.length,
            );

            setSelectedEvent(
                availableEvents[randomIndex],
            );

            setIsRolling(false);
            rollingTimeoutRef.current = null;
        }, 2000);
    };

    return (
        <section className="event-roulette">
            <div className="event-roulette__container">
                <div className="event-roulette__info">
                    <span className="event-roulette__eyebrow">
                        DON'T KNOW WHAT TO DO?
                    </span>

                    <h2 className="event-roulette__title">
                        Let us choose
                        <br />
                        your next event.
                    </h2>

                    <p className="event-roulette__description">
                        Set your budget and let StepOut pick
                        something interesting for tonight or
                        tomorrow.
                    </p>

                    <div className="event-roulette__budget">
                        <div className="event-roulette__budget-header">
                            <span>YOUR BUDGET</span>

                            <strong>
                                ₴{budget.toLocaleString()}
                            </strong>
                        </div>

                        <input
                            className="event-roulette__range"
                            type="range"
                            min="0"
                            max="10000"
                            step="100"
                            value={budget}
                            onChange={(event) =>
                                setBudget(Number(event.target.value))
                            }
                        />

                        <div className="event-roulette__range-labels">
                            <span>₴0</span>
                            <span>₴10,000</span>
                        </div>
                    </div>

                    <button
                        className="event-roulette__button"
                        type="button"
                        onClick={handleRoulette}
                        disabled={
                            isLoading ||
                            isRolling ||
                            loadError ||
                            !selectedCity
                        }
                    >
                        {isRolling
                            ? 'CHOOSING...'
                            : 'DECIDE FOR ME'}
                    </button>

                    {loadError && !isLoading && (
                        <p className="event-roulette__message">
                            We could not load events. Please try again later.
                        </p>
                    )}

                    {!loadError && !isLoading && events.length === 0 && (
                        <p className="event-roulette__message">
                            No events available right now.
                        </p>
                    )}

                    {!loadError && !isLoading &&
                        !isRolling &&
                        !selectedEvent &&
                        events.length > 0 &&
                        events.every((event) => event.price > budget) && (
                            <p className="event-roulette__message">
                                No events found within this budget.
                            </p>
                        )}

                    {isLoading && (
                        <p className="event-roulette__message">
                            Loading events...
                        </p>
                    )}
                </div>

                <div className="event-roulette__result">
                    {!selectedEvent && !isRolling && (
                        <div className="event-roulette__question">
                            <div className="event-roulette__question-icon">
                                <CircleHelp size={54} />
                            </div>

                            <span>
                                Your next event
                                <br />
                                is waiting
                            </span>
                        </div>
                    )}

                    {isRolling && (
                        <div className="event-roulette__rolling">
                            <div className="event-roulette__rolling-icon">
                                <CircleHelp size={52} />
                            </div>

                            <span>Choosing an event...</span>
                        </div>
                    )}

                    {selectedEvent && !isRolling && (
                        <div className="event-roulette__selected-event">
                            <EventCard event={selectedEvent} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};