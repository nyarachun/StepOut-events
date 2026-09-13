import axios from 'axios';
import {
    ArrowLeft,
    CalendarDays,
    Image,
    MapPin,
} from 'lucide-react';
import {
    useEffect,
    useState,
    type FormEvent,
} from 'react';
import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom';

import { api } from '../../api/api';
import type { EventItem } from '../../api/events';

import './EditEvent.scss';

type Category = {
    id: number;
    name: string;
};

type City = {
    id: number;
    name: string;
};

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] =
        useState<EventItem | null>(null);

    const [categories, setCategories] =
        useState<Category[]>([]);

    const [cities, setCities] =
        useState<City[]>([]);

    const [title, setTitle] =
        useState('');

    const [description, setDescription] =
        useState('');

    const [date, setDate] =
        useState('');

    const [address, setAddress] =
        useState('');

    const [price, setPrice] =
        useState('0');

    const [capacity, setCapacity] =
        useState('1');

    const [imageUrl, setImageUrl] =
        useState('');

    const [categoryId, setCategoryId] =
        useState('');

    const [cityId, setCityId] =
        useState('');

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);

    const [error, setError] =
        useState('');

    useEffect(() => {
        const loadData = async () => {
            if (!id) {
                return;
            }

            try {
                const [
                    eventResponse,
                    categoriesResponse,
                    citiesResponse,
                ] = await Promise.all([
                    api.get<EventItem>(
                        `/events/${id}`,
                    ),
                    api.get<Category[]>(
                        '/categories',
                    ),
                    api.get<City[]>(
                        '/cities',
                    ),
                ]);

                const currentEvent =
                    eventResponse.data;

                setEvent(currentEvent);
                setCategories(
                    categoriesResponse.data,
                );
                setCities(
                    citiesResponse.data,
                );

                setTitle(
                    currentEvent.title,
                );

                setDescription(
                    currentEvent.description,
                );

                const eventDate =
                    new Date(
                        currentEvent.date,
                    );

                const localDate =
                    new Date(
                        eventDate.getTime() -
                            eventDate.getTimezoneOffset() *
                                60000,
                    )
                        .toISOString()
                        .slice(0, 16);

                setDate(localDate);

                setAddress(
                    currentEvent.address,
                );

                setPrice(
                    String(
                        currentEvent.price,
                    ),
                );

                setCapacity(
                    String(
                        currentEvent.capacity,
                    ),
                );

                setImageUrl(
                    currentEvent.imageUrl ||
                        '',
                );

                setCategoryId(
                    String(
                        currentEvent.category.id,
                    ),
                );

                setCityId(
                    String(
                        currentEvent.city.id,
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

        loadData();
    }, [id]);

    const handleSubmit = async (
        eventObject: FormEvent<HTMLFormElement>,
    ) => {
        eventObject.preventDefault();

        if (!id) {
            return;
        }

        setError('');
        setIsSaving(true);

        try {
            await api.patch(
                `/events/${id}`,
                {
                    title: title.trim(),
                    description:
                        description.trim(),
                    date: new Date(
                        date,
                    ).toISOString(),
                    address: address.trim(),
                    price: Number(price),
                    capacity: Number(
                        capacity,
                    ),
                    imageUrl:
                        imageUrl.trim() ||
                        undefined,
                    categoryId:
                        Number(categoryId),
                    cityId:
                        Number(cityId),
                },
            );

            navigate('/my-events');
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
                          'Could not update event.',
                );
            } else {
                setError(
                    'Could not update event.',
                );
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <main className="edit-event">
                <div className="edit-event__loading">
                    Loading event...
                </div>
            </main>
        );
    }

    if (!event) {
        return (
            <main className="edit-event">
                <div className="edit-event__container">
                    <p className="edit-event__error">
                        {error ||
                            'Event not found.'}
                    </p>

                    <Link
                        to="/my-events"
                        className="edit-event__back"
                    >
                        <ArrowLeft
                            size={17}
                        />
                        Back to my events
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="edit-event">
            <div className="edit-event__container">
                <Link
                    className="edit-event__back"
                    to="/my-events"
                >
                    <ArrowLeft size={17} />
                    Back to my events
                </Link>

                <div className="edit-event__heading">
                    <span>
                        ORGANIZER
                    </span>

                    <h1>
                        Edit event
                    </h1>

                    <p>
                        Update the details of
                        your event.
                    </p>
                </div>

                <form
                    className="edit-event__form"
                    onSubmit={handleSubmit}
                >
                    <div className="edit-event__field">
                        <label htmlFor="title">
                            Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(
                                eventObject,
                            ) =>
                                setTitle(
                                    eventObject
                                        .target
                                        .value,
                                )
                            }
                            required
                        />
                    </div>

                    <div className="edit-event__field">
                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(
                                eventObject,
                            ) =>
                                setDescription(
                                    eventObject
                                        .target
                                        .value,
                                )
                            }
                            rows={6}
                            required
                        />
                    </div>

                    <div className="edit-event__grid">
                        <div className="edit-event__field">
                            <label htmlFor="date">
                                <CalendarDays
                                    size={15}
                                />
                                Date and time
                            </label>

                            <input
                                id="date"
                                type="datetime-local"
                                value={date}
                                onChange={(
                                    eventObject,
                                ) =>
                                    setDate(
                                        eventObject
                                            .target
                                            .value,
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="edit-event__field">
                            <label htmlFor="address">
                                <MapPin
                                    size={15}
                                />
                                Address
                            </label>

                            <input
                                id="address"
                                type="text"
                                value={address}
                                onChange={(
                                    eventObject,
                                ) =>
                                    setAddress(
                                        eventObject
                                            .target
                                            .value,
                                    )
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="edit-event__grid">
                        <div className="edit-event__field">
                            <label htmlFor="price">
                                Price
                            </label>

                            <input
                                id="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={price}
                                onChange={(
                                    eventObject,
                                ) =>
                                    setPrice(
                                        eventObject
                                            .target
                                            .value,
                                    )
                                }
                            />
                        </div>

                        <div className="edit-event__field">
                            <label htmlFor="capacity">
                                Capacity
                            </label>

                            <input
                                id="capacity"
                                type="number"
                                min="1"
                                value={capacity}
                                onChange={(
                                    eventObject,
                                ) =>
                                    setCapacity(
                                        eventObject
                                            .target
                                            .value,
                                    )
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="edit-event__grid">
                        <div className="edit-event__field">
                            <label htmlFor="category">
                                Category
                            </label>

                            <select
                                id="category"
                                value={categoryId}
                                onChange={(
                                    eventObject,
                                ) =>
                                    setCategoryId(
                                        eventObject
                                            .target
                                            .value,
                                    )
                                }
                                required
                            >
                                <option value="">
                                    Select category
                                </option>

                                {categories.map(
                                    (
                                        category,
                                    ) => (
                                        <option
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        <div className="edit-event__field">
                            <label htmlFor="city">
                                City
                            </label>

                            <select
                                id="city"
                                value={cityId}
                                onChange={(
                                    eventObject,
                                ) =>
                                    setCityId(
                                        eventObject
                                            .target
                                            .value,
                                    )
                                }
                                required
                            >
                                <option value="">
                                    Select city
                                </option>

                                {cities.map(
                                    (city) => (
                                        <option
                                            key={
                                                city.id
                                            }
                                            value={
                                                city.id
                                            }
                                        >
                                            {
                                                city.name
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="edit-event__field">
                        <label htmlFor="imageUrl">
                            <Image
                                size={15}
                            />
                            Image URL
                        </label>

                        <input
                            id="imageUrl"
                            type="url"
                            value={imageUrl}
                            onChange={(
                                eventObject,
                            ) =>
                                setImageUrl(
                                    eventObject
                                        .target
                                        .value,
                                )
                            }
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {error && (
                        <p className="edit-event__error">
                            {error}
                        </p>
                    )}

                    <button
                        className="edit-event__submit"
                        type="submit"
                        disabled={isSaving}
                    >
                        {isSaving
                            ? 'Saving...'
                            : 'Save changes'}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default EditEvent;