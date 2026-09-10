import {
    Activity,
    Baby,
    Camera,
    Clapperboard,
    Dumbbell,
    Gamepad2,
    Gem,
    GraduationCap,
    HeartPulse,
    Laugh,
    Laptop,
    Map,
    MapPin,
    Mic2,
    Music,
    Palette,
    PawPrint,
    ShoppingBag,
    Sparkles,
    Theater,
    Utensils,
    Users,
    Wrench,
    type LucideIcon,
} from 'lucide-react';
import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { getCategories, type Category } from '../../api/categories';
import { getEvents } from '../../api/events';
import { useCity } from '../../context/CityContext';
import type { EventCardData } from '../../components/EventCard/EventCard';
import {
    EventCarousel,
} from '../../components/EventCarousel/EventCarousel';
import { filterEvents } from '../../components/EventCarousel/eventFilters';

import './Events.scss';

const categoryIcons: Record<
    string,
    LucideIcon
> = {
    Music,
    'Food & Drinks': Utensils,
    Sports: Dumbbell,
    Comedy: Laugh,
    Workshops: Wrench,
    'Art & Culture': Palette,
    Nightlife: Sparkles,
    Outdoor: Map,
    'Film & Cinema': Clapperboard,
    Theatre: Theater,
    Festivals: Mic2,
    Networking: Users,
    Education: GraduationCap,
    Technology: Laptop,
    'Health & Wellness': HeartPulse,
    Travel: Map,
    Photography: Camera,
    Fashion: Gem,
    Gaming: Gamepad2,
    'Kids & Family': Baby,
    Pets: PawPrint,
    'Volunteering': HeartPulse,
    'Markets & Fairs': ShoppingBag,
    Business: Activity,
};

type DateFilter =
    | 'anytime'
    | 'week'
    | 'month';

const getCategoryIcon = (
    categoryName: string,
) => {
    return (
        categoryIcons[categoryName] || Sparkles
    );
};

const getDateRange = (
    dateFilter: DateFilter,
) => {
    const now = new Date();

    if (dateFilter === 'anytime') {
        return {};
    }

    if (dateFilter === 'week') {
        const currentDay = now.getDay();

        const daysFromMonday =
            currentDay === 0
                ? 6
                : currentDay - 1;

        const dateFrom = new Date(now);

        dateFrom.setDate(
            now.getDate() - daysFromMonday,
        );
        dateFrom.setHours(0, 0, 0, 0);

        const dateTo = new Date(dateFrom);

        dateTo.setDate(
            dateFrom.getDate() + 6,
        );
        dateTo.setHours(23, 59, 59, 999);

        return {
            dateFrom: dateFrom.toISOString(),
            dateTo: dateTo.toISOString(),
        };
    }

    const dateFrom = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
    );

    const dateTo = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
    );

    dateTo.setHours(23, 59, 59, 999);

    return {
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
    };
};

const Events = () => {
    const [searchParams] = useSearchParams();

    const {
        selectedCity,
    } = useCity();

    const [events, setEvents] = useState<
        EventCardData[]
    >([]);

    const [categories, setCategories] = useState<
        Category[]
    >([]);

    const [selectedCategoryId, setSelectedCategoryId] =
        useState<number | undefined>();

    const [maxPrice, setMaxPrice] =
        useState(10000);

    const [dateFilter, setDateFilter] =
        useState<DateFilter>('anytime');

    const [isLoading, setIsLoading] =
        useState(true);

    const categoryListRef =
        useRef<HTMLDivElement | null>(null);
    const [canScrollCategoriesLeft, setCanScrollCategoriesLeft] =
        useState(false);
    const [canScrollCategoriesRight, setCanScrollCategoriesRight] =
        useState(true);

    const searchQuery =
        searchParams.get('search') || '';

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);

                const [
                    eventsData,
                    categoriesData,
                ] = await Promise.all([
                    getEvents(),
                    getCategories(),
                ]);

                setEvents(eventsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error(
                    'Failed to load events page data',
                    error,
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        const categoryList = categoryListRef.current;

        if (!categoryList) {
            return;
        }

        const updateCategoryButtons = () => {
            const maxScrollLeft =
                categoryList.scrollWidth - categoryList.clientWidth;

            setCanScrollCategoriesLeft(
                categoryList.scrollLeft > 1,
            );
            setCanScrollCategoriesRight(
                categoryList.scrollLeft < maxScrollLeft - 1,
            );
        };

        const resizeObserver = new ResizeObserver(
            updateCategoryButtons,
        );

        categoryList.addEventListener(
            'scroll',
            updateCategoryButtons,
            { passive: true },
        );
        resizeObserver.observe(categoryList);
        requestAnimationFrame(updateCategoryButtons);

        return () => {
            categoryList.removeEventListener(
                'scroll',
                updateCategoryButtons,
            );
            resizeObserver.disconnect();
        };
    }, [categories.length]);

    const dateRange = useMemo(() => {
        return getDateRange(dateFilter);
    }, [dateFilter]);

    const filters = useMemo(() => {
        return {
            cityId: selectedCity?.id,
            categoryId: selectedCategoryId,
            maxPrice,
            dateFrom: dateRange.dateFrom,
            dateTo: dateRange.dateTo,
            search: searchQuery || undefined,
        };
    }, [
        selectedCity,
        selectedCategoryId,
        maxPrice,
        dateRange,
        searchQuery,
    ]);

    const recommendedEvents = useMemo(() => {
        const cityEvents = selectedCity
            ? events.filter(
                (event) =>
                    event.cityId ===
                    selectedCity.id,
            )
            : events;

        return [...cityEvents]
            .sort((a, b) => a.id - b.id)
            .slice(0, 8);
    }, [
        events,
        selectedCity,
    ]);

    const filteredEvents = useMemo(
        () => filterEvents(events, filters),
        [events, filters],
    );

    const scrollCategories = (
        direction: number,
    ) => {
        if (!categoryListRef.current) {
            return;
        }

        categoryListRef.current.scrollBy({
            left: direction * 300,
            behavior: 'smooth',
        });
    };

    const handleCategoryClick = (
        categoryId?: number,
    ) => {
        setSelectedCategoryId(categoryId);
    };

    const mainTitle = searchQuery
        ? `Search results for "${searchQuery}"`
        : selectedCity
            ? `Events in ${selectedCity.name}`
            : 'All events';

    return (
        <main className="events-page">
            <div className="events-page__container">
                <section className="events-page__intro">
                    <h1 className="events-page__title">
                        Find your next event
                    </h1>
                </section>

                <section className="events-page__categories">
                    <div className="events-page__categories-header">
                        <h2>Categories</h2>

                        <div className="events-page__category-buttons">
                            <button
                                type="button"
                                disabled={!canScrollCategoriesLeft}
                                onClick={() =>
                                    scrollCategories(-1)
                                }
                                aria-label="Previous categories"
                            >
                                <ChevronLeft size={19} />
                            </button>

                            <button
                                type="button"
                                disabled={!canScrollCategoriesRight}
                                onClick={() =>
                                    scrollCategories(1)
                                }
                                aria-label="Next categories"
                            >
                                <ChevronRight size={19} />
                            </button>
                        </div>
                    </div>

                    <div
                        className="events-page__category-row"
                        ref={categoryListRef}
                    >
                        <button
                            className={
                                selectedCategoryId === undefined
                                    ? 'events-page__category events-page__category--active'
                                    : 'events-page__category'
                            }
                            type="button"
                            onClick={() =>
                                handleCategoryClick()
                            }
                        >
                            <Activity size={19} />
                            <span>All</span>
                        </button>

                        {categories.map((category) => {
                            const Icon = getCategoryIcon(
                                category.name,
                            );

                            const isActive =
                                selectedCategoryId ===
                                category.id;

                            return (
                                <button
                                    className={
                                        isActive
                                            ? 'events-page__category events-page__category--active'
                                            : 'events-page__category'
                                    }
                                    type="button"
                                    key={category.id}
                                    onClick={() =>
                                        handleCategoryClick(
                                            category.id,
                                        )
                                    }
                                >
                                    <Icon size={19} />
                                    <span>{category.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section className="events-page__filters">
                    <div className="events-page__filter">
                        <div className="events-page__filter-header">
                            <span>MAX PRICE</span>

                            <strong>
                                ₴{maxPrice.toLocaleString()}
                            </strong>
                        </div>

                        <input
                            className="events-page__price-range"
                            type="range"
                            min="0"
                            max="10000"
                            step="100"
                            value={maxPrice}
                            onChange={(event) =>
                                setMaxPrice(
                                    Number(event.target.value),
                                )
                            }
                        />

                        <div className="events-page__range-labels">
                            <span>₴0</span>
                            <span>₴10,000</span>
                        </div>
                    </div>

                    <div className="events-page__filter events-page__date-filter">
                        <label htmlFor="date-filter">
                            DATE
                        </label>

                        <select
                            id="date-filter"
                            value={dateFilter}
                            onChange={(event) =>
                                setDateFilter(
                                    event.target.value as DateFilter,
                                )
                            }
                        >
                            <option value="anytime">
                                Anytime
                            </option>

                            <option value="week">
                                This week
                            </option>

                            <option value="month">
                                This month
                            </option>
                        </select>
                    </div>
                </section>

                <section className="events-page__results">
                    <div className="events-page__results-header">
                        <div>
                            <span className="events-page__results-city">
                                {selectedCity ? (
                                    <>
                                        <MapPin size={14} />
                                        {selectedCity.name}
                                    </>
                                ) : (
                                    'ALL CITIES'
                                )}
                            </span>

                            <h2>{mainTitle}</h2>
                        </div>

                        {!isLoading && (
                            <span className="events-page__results-count">
                                {filteredEvents.length} events
                            </span>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="events-page__loading">
                            Loading events...
                        </div>
                    ) : (
                        <EventCarousel
                            title=""
                            events={events}
                            filters={filters}
                        />
                    )}
                </section>

                <section className="events-page__recommended">
                    <div className="events-page__recommended-header">
                        <div>
                            <span className="events-page__eyebrow">
                                JUST FOR YOU
                            </span>

                            <h2>
                                Recommended for you
                            </h2>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="events-page__loading">
                            Loading recommendations...
                        </div>
                    ) : (
                        <EventCarousel
                            title=""
                            events={recommendedEvents}
                        />
                    )}
                </section>
            </div>
        </main>
    );
};

export default Events;