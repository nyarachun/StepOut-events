import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react';

type FavoritesContextValue = {
    favoriteEventIds: number[];
    isFavorite: (eventId: number) => boolean;
    toggleFavorite: (eventId: number) => void;
};

const STORAGE_KEY = 'favoriteEventIds';

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

type FavoritesProviderProps = {
    children: ReactNode;
};

const getStoredFavoriteIds = () => {
    try {
        const storedIds = localStorage.getItem(STORAGE_KEY);

        if (!storedIds) {
            return [];
        }

        const parsedIds: unknown = JSON.parse(storedIds);

        return Array.isArray(parsedIds)
            ? parsedIds.filter((id): id is number => typeof id === 'number')
            : [];
    } catch {
        return [];
    }
};

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
    const [favoriteEventIds, setFavoriteEventIds] = useState<number[]>(
        getStoredFavoriteIds,
    );

    const toggleFavorite = (eventId: number) => {
        setFavoriteEventIds((currentIds) => {
            const nextIds = currentIds.includes(eventId)
                ? currentIds.filter((id) => id !== eventId)
                : [...currentIds, eventId];

            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));

            return nextIds;
        });
    };

    const isFavorite = (eventId: number) =>
        favoriteEventIds.includes(eventId);

    return (
        <FavoritesContext.Provider
            value={{
                favoriteEventIds,
                isFavorite,
                toggleFavorite,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = () => {
    const context = useContext(FavoritesContext);

    if (!context) {
        throw new Error('useFavorites must be used inside FavoritesProvider');
    }

    return context;
};