import {
    ArrowRight,
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

import './Register.scss';

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] =
        useState('');
    const [email, setEmail] =
        useState('');
    const [password, setPassword] =
        useState('');
    const [role, setRole] =
        useState<'user' | 'organizer'>(
            'user',
        );
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
            await api.post(
                '/auth/register',
                {
                    name,
                    email,
                    password,
                    role,
                },
            );

            navigate('/login');
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
                          'Registration failed.',
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
        <main className="register">
            <section className="register__top" />

            <section className="register__content">
                <div className="register__container">
                    <div className="register__heading">
                        <span className="register__eyebrow">
                            JOIN STEPOUT
                        </span>

                        <h1 className="register__title">
                            Create account
                        </h1>

                        <p className="register__description">
                            Discover events, meet
                            people and find
                            something worth
                            stepping out for.
                        </p>
                    </div>

                    <form
                        className="register__form"
                        onSubmit={
                            handleSubmit
                        }
                    >
                        <div className="register__field">
                            <label htmlFor="name">
                                Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(
                                    event,
                                ) =>
                                    setName(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                required
                                autoComplete="name"
                            />
                        </div>

                        <div className="register__field">
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

                        <div className="register__field">
                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="register__password">
                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Create a password"
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
                                    autoComplete="new-password"
                                />

                                <button
                                    className="register__password-toggle"
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

                        <div className="register__role">
                            <span>
                                Account type
                            </span>

                            <div className="register__role-options">
                                <button
                                    className={
                                        role ===
                                        'user'
                                            ? 'register__role-option register__role-option--active'
                                            : 'register__role-option'
                                    }
                                    type="button"
                                    onClick={() =>
                                        setRole(
                                            'user',
                                        )
                                    }
                                >
                                    User
                                </button>

                                <button
                                    className={
                                        role ===
                                        'organizer'
                                            ? 'register__role-option register__role-option--active'
                                            : 'register__role-option'
                                    }
                                    type="button"
                                    onClick={() =>
                                        setRole(
                                            'organizer',
                                        )
                                    }
                                >
                                    Organizer
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="register__error">
                                {error}
                            </p>
                        )}

                        <button
                            className="register__submit"
                            type="submit"
                            disabled={
                                isLoading
                            }
                        >
                            <span>
                                {isLoading
                                    ? 'Creating account...'
                                    : 'Create account'}
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

                    <p className="register__login">
                        <span>
                            Already have an Account?
                        </span>

                        <Link to="/login">
                            Sign in
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Register;