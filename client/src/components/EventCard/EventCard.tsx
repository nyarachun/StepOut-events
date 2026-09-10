import {
    CalendarDays,
    Heart,
    MapPin,
    Ticket,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useFavorites } from '../../context/FavoritesContext';

import './EventCard.scss';

export type EventCardData = {
    id: number;
    title: string;
    description: string;
    date: string;
    address: string;
    price: number;
    imageUrl: string;
    categoryId: number;
    cityId: number;
};

type EventCardProps = {
    event: EventCardData;
};

export const EventCard = ({
    event,
}: EventCardProps) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const eventIsFavorite = isFavorite(event.id);

    const formattedDate = new Date(
        event.date,
    ).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <article className="event-card">
            <div className="event-card__image-wrapper">
                <Link to={`/events/${event.id}`}>
                    <img
                        className="event-card__image"
                        src={event.imageUrl}
                        alt={event.title}
                    />
                </Link>

                <button
                    className={
                        eventIsFavorite
                            ? 'event-card__favorite event-card__favorite--active'
                            : 'event-card__favorite'
                    }
                    type="button"
                    onClick={() => toggleFavorite(event.id)}
                    aria-label={
                        eventIsFavorite
                            ? 'Remove from favorites'
                            : 'Add to favorites'
                    }
                >
                    <Heart
                        className="event-card__heart"
                        size={19}
                        fill={
                            eventIsFavorite ? 'currentColor' : 'none'
                        }
                    />
                </button>
            </div>

            <div className="event-card__content">
                <div className="event-card__date">
                    <CalendarDays size={15} />
                    <span>{formattedDate}</span>
                </div>

                <Link
                    className="event-card__title"
                    to={`/events/${event.id}`}
                >
                    {event.title}
                </Link>

                <p className="event-card__description">
                    {event.description}
                </p>

                <div className="event-card__details">
                    <div className="event-card__detail">
                        <MapPin size={15} />
                        <span>{event.address}</span>
                    </div>

                    <div className="event-card__detail">
                        <Ticket size={15} />

                        <span>
                            {event.price === 0
                                ? 'Free'
                                : `₴${event.price.toLocaleString()}`}
                        </span>
                    </div>
                </div>
            </div>

            <Link
                className="event-card__button"
                to={`/events/${event.id}`}
            >
                VIEW EVENT
            </Link>
        </article>
    );
};