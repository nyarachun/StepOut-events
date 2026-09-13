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
} from 'react-router-dom';

import { api } from '../../api/api';
import {
    createEvent,
    type CreateEventData,
} from '../../api/events';
import { useCity } from '../../context/CityContext';

import './CreateEvent.scss';

type Category = {
    id: number;
    name: string;
};

const CreateEvent = () => {
    const navigate = useNavigate();

    const {
        cities,
        selectedCity,
    } = useCity();

    const [categories, setCategories] =
        useState<Category[]>([]);

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
        useState('10');

    const [imageUrl, setImageUrl] =
        useState('');

    const [categoryId, setCategoryId] =
        useState('');

    const [cityId, setCityId] =
        useState(
            selectedCity
                ? String(selectedCity.id)
                : '',
        );

    const [error, setError] =
        useState('');

    const [isLoading, setIsLoading] =
        useState(false);

    useEffect(() => {
        const loadCategories =
            async () => {
                try {
                    const response =
                        await api.get<
                            Category[]
                        >('/categories');

                    setCategories(
                        response.data,
                    );
                } catch {
                    setError(
                        'Could not load categories.',
                    );
                }
            };

        loadCategories();
    }, []);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError('');
        setIsLoading(true);

        if (!categoryId) {
            setError(
                'Please select a category.',
            );
            setIsLoading(false);

            return;
        }

        if (!cityId) {
            setError(
                'Please select a city.',
            );
            setIsLoading(false);

            return;
        }

        const eventData: CreateEventData =
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
                imageUrl.trim(),
            categoryId:
                Number(categoryId),
            cityId: Number(cityId),
        };

        try {
            await createEvent(
                eventData,
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
                        'Could not create event.',
                );
            } else {
                setError(
                    'Could not create event.',
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="create-event">
            <div className="create-event__container">
                <Link
                    className="create-event__back"
                    to="/my-events"
                >
                    <ArrowLeft size={17} />
                    Back to my events
                </Link>

                <div className="create-event__heading">
                    <span>
                        ORGANIZER
                    </span>

                    <h1>
                        Create an event
                    </h1>

                    <p>
                        Share something
                        worth stepping
                        out for.
                    </p>
                </div>

                <form
                    className="create-event__form"
                    onSubmit={
                        handleSubmit
                    }
                >
                    <div className="create-event__field">
                        <label htmlFor="title">
                            Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(
                                event,
                            ) =>
                                setTitle(
                                    event
                                        .target
                                        .value,
                                )
                            }
                            placeholder="Event title"
                            required
                        />
                    </div>

                    <div className="create-event__field">
                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(
                                event,
                            ) =>
                                setDescription(
                                    event
                                        .target
                                        .value,
                                )
                            }
                            placeholder="Tell people what your event is about..."
                            rows={6}
                            required
                        />
                    </div>

                    <div className="create-event__grid">
                        <div className="create-event__field">
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
                                    event,
                                ) =>
                                    setDate(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="create-event__field">
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
                                    event,
                                ) =>
                                    setAddress(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                placeholder="Event address"
                                required
                            />
                        </div>
                    </div>

                    <div className="create-event__grid">
                        <div className="create-event__field">
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
                                    event,
                                ) =>
                                    setPrice(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                            />
                        </div>

                        <div className="create-event__field">
                            <label htmlFor="capacity">
                                Capacity
                            </label>

                            <input
                                id="capacity"
                                type="number"
                                min="1"
                                value={
                                    capacity
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setCapacity(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="create-event__grid">
                        <div className="create-event__field">
                            <label htmlFor="category">
                                Category
                            </label>

                            <select
                                id="category"
                                value={
                                    categoryId
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setCategoryId(
                                        event
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

                        <div className="create-event__field">
                            <label htmlFor="city">
                                City
                            </label>

                            <select
                                id="city"
                                value={cityId}
                                onChange={(
                                    event,
                                ) =>
                                    setCityId(
                                        event
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
                                    (
                                        city,
                                    ) => (
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

                    <div className="create-event__field">
                        <label htmlFor="imageUrl">
                            <Image
                                size={15}
                            />
                            Image URL
                        </label>

                        <input
                            id="imageUrl"
                            type="url"
                            value={
                                imageUrl
                            }
                            onChange={(
                                event,
                            ) =>
                                setImageUrl(
                                    event
                                        .target
                                        .value,
                                )
                            }
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {error && (
                        <p className="create-event__error">
                            {error}
                        </p>
                    )}

                    <button
                        className="create-event__submit"
                        type="submit"
                        disabled={
                            isLoading
                        }
                    >
                        {isLoading
                            ? 'Creating...'
                            : 'Create event'}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default CreateEvent;