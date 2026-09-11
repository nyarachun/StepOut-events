import {
    ArrowRight,
    Check,
    Eye,
    EyeOff,
} from 'lucide-react';
import axios from 'axios';
import {
    useState,
    type FormEvent,
} from 'react';
import {
    Link,
    useNavigate,
} from 'react-router-dom';

import { api } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

import './Login.scss';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] =
        useState('');
    const [password, setPassword] =
        useState('');
    const [rememberMe, setRememberMe] =
        useState(false);
    const [showPassword, setShowPassword] =
        useState(false);
    const [isLoading, setIsLoading] =
        useState(false);
    const [error, setError] =
        useState('');

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError('');
        setIsLoading(true);

        try {
            const response =
                await api.post(
                    '/auth/login',
                    {
                        email,
                        password,
                    },
                );

            const token =
                response.data.access_token;

            login(
                token,
                rememberMe,
            );

            navigate('/profile');
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
                          'Invalid email or password.',
                );
            } else {
                setError(
                    'Something went wrong. Please try again.',
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="login">
            <section className="login__top" />

            <section className="login__content">
                <div className="login__container">
                    <div className="login__heading">
                        <span className="login__eyebrow">
                            WELCOME BACK
                        </span>

                        <h1 className="login__title">
                            Sign in
                        </h1>
                    </div>

                    <form
                        className="login__form"
                        onSubmit={
                            handleSubmit
                        }
                    >
                        <div className="login__field">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="myemail@email.com"
                                value={email}
                                onChange={(
                                    event,
                                ) =>
                                    setEmail(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="login__field">
                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="login__password">
                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="enter your password"
                                    value={
                                        password
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setPassword(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    required
                                    autoComplete="current-password"
                                />

                                <button
                                    className="login__password-toggle"
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (
                                                current,
                                            ) =>
                                                !current,
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff
                                            size={
                                                18
                                            }
                                        />
                                    ) : (
                                        <Eye
                                            size={
                                                18
                                            }
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="login__actions">
                            <label className="login__remember">
                                <input
                                    type="checkbox"
                                    checked={
                                        rememberMe
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setRememberMe(
                                            event
                                                .target
                                                .checked,
                                        )
                                    }
                                />

                                <span className="login__checkbox">
                                    <Check
                                        size={
                                            12
                                        }
                                    />
                                </span>

                                <span>
                                    Remember Me
                                </span>
                            </label>

                            <Link
                                className="login__forgot"
                                to="/forgot-password"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {error && (
                            <p className="login__error">
                                {error}
                            </p>
                        )}

                        <button
                            className="login__submit"
                            type="submit"
                            disabled={
                                isLoading
                            }
                        >
                            <span>
                                {isLoading
                                    ? 'Logging in...'
                                    : 'Log in'}
                            </span>

                            {!isLoading && (
                                <ArrowRight
                                    size={
                                        18
                                    }
                                />
                            )}
                        </button>
                    </form>

                    <p className="login__signup">
                        <span>
                            Don't have an Account?
                        </span>

                        <Link to="/register">
                            Sign up
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Login;