import axios from 'axios';
import {
    Check,
    Users,
} from 'lucide-react';
import {
    useEffect,
    useState,
    type FormEvent,
} from 'react';
import {
    useNavigate,
} from 'react-router-dom';

import { api } from '../../api/api';
import {
    createOrJoinSquad,
} from '../../api/squads';
import { interests } from '../../data/interests';
import { useCity } from '../../context/CityContext';

import './Squads.scss';

type Category = {
    id: number;
    name: string;
};

const groupSizes = [
    {
        min: 2,
        max: 3,
        label: '2–3 people',
    },
    {
        min: 4,
        max: 5,
        label: '4–5 people',
    },
    {
        min: 5,
        max: 6,
        label: '5–6 people',
    },
];

const Squads = () => {
    const navigate = useNavigate();

    const {
        cities,
        selectedCity,
    } = useCity();

    const [categories, setCategories] =
        useState<Category[]>([]);

    const [categoryId, setCategoryId] =
        useState('');

    const [cityId, setCityId] =
        useState(
            selectedCity
                ? String(selectedCity.id)
                : '',
        );

    const [groupSizeMin, setGroupSizeMin] =
        useState(2);

    const [groupSizeMax, setGroupSizeMax] =
        useState(3);

    const [
        selectedInterests,
        setSelectedInterests,
    ] = useState<string[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] =
        useState('');

    const [success, setSuccess] =
        useState('');

    useEffect(() => {
        const loadCategories =
            async () => {
                try {
                    const response =
                        await api.get<
                            Category[]
                        >(
                            '/categories',
                        );

                    setCategories(
                        response.data,
                    );
                } catch {
                    setError(
                        'Could not load categories.',
                    );
                } finally {
                    setIsLoading(false);
                }
            };

        void loadCategories();
    }, []);

    const toggleInterest = (
        interest: string,
    ) => {
        setSelectedInterests(
            (current) =>
                current.includes(interest)
                    ? current.filter(
                        (item) =>
                            item !==
                            interest,
                    )
                    : [
                        ...current,
                        interest,
                    ],
        );
    };

    const handleGroupSizeChange = (
        min: number,
        max: number,
    ) => {
        setGroupSizeMin(min);
        setGroupSizeMax(max);
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError('');
        setSuccess('');

        if (!cityId) {
            setError(
                'Please select a city.',
            );

            return;
        }

        if (!categoryId) {
            setError(
                'Please select an event type.',
            );

            return;
        }

        if (
            selectedInterests.length ===
            0
        ) {
            setError(
                'Select at least one interest.',
            );

            return;
        }

        setIsSubmitting(true);

        try {
            const squad =
                await createOrJoinSquad({
                    cityId: Number(
                        cityId,
                    ),
                    categoryId:
                        Number(
                            categoryId,
                        ),
                    groupSizeMin,
                    groupSizeMax,
                    interests:
                        selectedInterests,
                });

            if (
                squad.status ===
                'formed'
            ) {
                navigate(
                    '/messages',
                );

                return;
            }

            setSuccess(
                'Your squad search is active. We will match you with people who fit your preferences.',
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
                    Array.isArray(
                        message,
                    )
                        ? message.join(
                            ', ',
                        )
                        : message ||
                        'Could not create squad.',
                );
            } else {
                setError(
                    'Could not create squad.',
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="squads-page">
                <div className="squads-page__loading">
                    Loading...
                </div>
            </main>
        );
    }

    return (
        <main className="squads-page">
            <div className="squads-page__container">
                <header className="squads-page__header">
                    <span>
                        FIND YOUR PEOPLE
                    </span>

                    <h1>
                        Build a squad
                    </h1>

                    <p>
                        Choose your interests
                        and preferences. We will
                        match you with people
                        looking for the same kind
                        of experience.
                    </p>
                </header>

                <form
                    className="squads-page__form"
                    onSubmit={
                        handleSubmit
                    }
                >
                    <section className="squads-page__section">
                        <div className="squads-page__section-heading">
                            <Users
                                size={19}
                            />

                            <div>
                                <h2>
                                    Group size
                                </h2>

                                <p>
                                    How many
                                    people do
                                    you want in
                                    your squad?
                                </p>
                            </div>
                        </div>

                        <div className="squads-page__group-options">
                            {groupSizes.map(
                                (
                                    option,
                                ) => {
                                    const isActive =
                                        groupSizeMin ===
                                        option.min &&
                                        groupSizeMax ===
                                        option.max;

                                    return (
                                        <button
                                            key={`${option.min}-${option.max}`}
                                            type="button"
                                            className={
                                                isActive
                                                    ? 'is-active'
                                                    : ''
                                            }
                                            onClick={() =>
                                                handleGroupSizeChange(
                                                    option.min,
                                                    option.max,
                                                )
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    </section>

                    <section className="squads-page__section">
                        <div className="squads-page__section-heading">
                            <div>
                                <h2>
                                    Event type
                                </h2>

                                <p>
                                    What kind of
                                    event are
                                    you interested
                                    in?
                                </p>
                            </div>
                        </div>

                        <select
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
                        >
                            <option value="">
                                Select event
                                type
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
                    </section>

                    <section className="squads-page__section">
                        <div className="squads-page__section-heading">
                            <div>
                                <h2>
                                    City
                                </h2>

                                <p>
                                    Where do you
                                    want to
                                    explore
                                    together?
                                </p>
                            </div>
                        </div>

                        <select
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
                    </section>

                    <section className="squads-page__section">
                        <div className="squads-page__section-heading">
                            <div>
                                <h2>
                                    Interests
                                </h2>

                                <p>
                                    Pick the things
                                    you enjoy.
                                    At least one.
                                </p>
                            </div>

                            <span>
                                {
                                    selectedInterests.length
                                }
                                /10
                            </span>
                        </div>

                        <div className="squads-page__interests">
                            {interests.map(
                                (
                                    interest,
                                ) => {
                                    const isSelected =
                                        selectedInterests.includes(
                                            interest,
                                        );

                                    return (
                                        <button
                                            key={
                                                interest
                                            }
                                            type="button"
                                            className={
                                                isSelected
                                                    ? 'is-selected'
                                                    : ''
                                            }
                                            onClick={() =>
                                                toggleInterest(
                                                    interest,
                                                )
                                            }
                                        >
                                            {isSelected && (
                                                <Check
                                                    size={
                                                        14
                                                    }
                                                />
                                            )}

                                            {
                                                interest
                                            }
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    </section>

                    {error && (
                        <p className="squads-page__error">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="squads-page__success">
                            {success}
                        </p>
                    )}

                    <button
                        className="squads-page__submit"
                        type="submit"
                        disabled={
                            isSubmitting
                        }
                    >
                        {isSubmitting
                            ? 'Finding your squad...'
                            : 'Find my squad'}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Squads;