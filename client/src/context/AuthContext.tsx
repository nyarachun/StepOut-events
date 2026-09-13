import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

import { api } from '../api/api';

export type UserRole =
    | 'user'
    | 'organizer'
    | 'admin';

export type CurrentUser = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
};

type AuthContextType = {
    isAuthenticated: boolean;
    user: CurrentUser | null;
    isLoading: boolean;
    login: (
        token: string,
        rememberMe: boolean,
    ) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
};

const AuthContext =
    createContext<AuthContextType | null>(
        null,
    );

type AuthProviderProps = {
    children: ReactNode;
};

const getStoredToken = () => {
    return (
        localStorage.getItem(
            'accessToken',
        ) ||
        sessionStorage.getItem(
            'accessToken',
        )
    );
};

export const AuthProvider = ({
    children,
}: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] =
        useState(() =>
            Boolean(getStoredToken()),
        );

    const [user, setUser] =
        useState<CurrentUser | null>(
            null,
        );

    const [isLoading, setIsLoading] =
        useState(true);

    const refreshUser =
        async () => {
            const token =
                getStoredToken();

            if (!token) {
                setUser(null);
                setIsAuthenticated(false);
                setIsLoading(false);

                return;
            }

            try {
                const response =
                    await api.get<CurrentUser>(
                        '/users/me',
                    );

                setUser(
                    response.data,
                );

                setIsAuthenticated(true);
            } catch {
                localStorage.removeItem(
                    'accessToken',
                );

                sessionStorage.removeItem(
                    'accessToken',
                );

                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        refreshUser();
    }, []);

    const login = (
        token: string,
        rememberMe: boolean,
    ) => {
        localStorage.removeItem(
            'accessToken',
        );

        sessionStorage.removeItem(
            'accessToken',
        );

        const storage = rememberMe
            ? localStorage
            : sessionStorage;

        storage.setItem(
            'accessToken',
            token,
        );

        setIsAuthenticated(true);

        void refreshUser();
    };

    const logout = () => {
        localStorage.removeItem(
            'accessToken',
        );

        sessionStorage.removeItem(
            'accessToken',
        );

        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                isLoading,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth must be used inside AuthProvider',
        );
    }

    return context;
};