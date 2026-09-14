import {
    Navigate,
    useLocation,
} from 'react-router-dom';

import {
    useAuth,
    type UserRole,
} from '../../context/AuthContext';
import type { JSX } from 'react/jsx-runtime';

type ProtectedRouteProps = {
    children: JSX.Element;
    allowedRoles?: UserRole[];
};

export const ProtectedRoute = ({
    children,
    allowedRoles,
}: ProtectedRouteProps) => {
    const {
        isAuthenticated,
        user,
        isLoading,
    } = useAuth();

    const location = useLocation();

    if (isLoading) {
        return (
            <div className="protected-route__loading">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    if (
        allowedRoles &&
        (!user ||
            !allowedRoles.includes(
                user.role,
            ))
    ) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
};