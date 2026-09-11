import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react';

type AuthContextType = {
    isAuthenticated: boolean;
    login: (
        token: string,
        rememberMe: boolean,
    ) => void;
    logout: () => void;
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
    const [
        isAuthenticated,
        setIsAuthenticated,
    ] = useState(() =>
        Boolean(getStoredToken()),
    );

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
    };

    const logout = () => {
        localStorage.removeItem(
            'accessToken',
        );

        sessionStorage.removeItem(
            'accessToken',
        );

        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                login,
                logout,
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