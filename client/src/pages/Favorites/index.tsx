import { useEffect, useState } from 'react';

import { getEvents } from '../../api/events';
import { EventCarousel } from '../../components/EventCarousel/EventCarousel';
import type { EventCardData } from '../../components/EventCard/EventCard';
import { useFavorites } from '../../context/FavoritesContext';

import './Favorites.scss';

const Favorites = () => {
    const { favoriteEventIds } = useFavorites();
    const [events, setEvents] = useState<EventCardData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                setIsLoading(true);
                setHasError(false);
                setEvents(await getEvents());
            } catch (error) {
                setHasError(true);
                console.error('Failed to load favorite events', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadEvents();
    }, []);

    const favoriteEvents = events.filter((event) =>
        favoriteEventIds.includes(event.id),
    );

    return (
        <main className="favorites-page">
            <div className="favorites-page__container">
                <span className="favorites-page__eyebrow">YOUR COLLECTION</span>

                <h1 className="favorites-page__title">Favorites</h1>

                <p className="favorites-page__description">
                    Keep the events you want to come back to in one place.
                </p>

                {isLoading && (
                    <div className="favorites-page__message">
                        Loading favorites...
                    </div>
                )}

                {!isLoading && hasError && (
                    <div className="favorites-page__message">
                        We could not load your favorites. Please try again later.
                    </div>
                )}

                {!isLoading && !hasError && favoriteEvents.length === 0 && (
                    <div className="favorites-page__message">
                        You have not added any events to favorites yet.
                    </div>
                )}

                {!isLoading && !hasError && favoriteEvents.length > 0 && (
                    <EventCarousel events={favoriteEvents} />
                )}
            </div>
        </main>
    );
};

export default Favorites;