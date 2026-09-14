import axios from 'axios';
import {
    ArrowRight,
    Eye,
    EyeOff,
} from 'lucide-react';
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

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] =
        useState('');
    const [confirmPassword, setConfirmPassword] =
        useState('');

    const [role, setRole] =
        useState<'user' | 'organizer'>('user');

    const [showPassword, setShowPassword] =
        useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [error, setError] =
        useState('');

    const [isLoading, setIsLoading] =
        useState(false);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match.');

            return;
        }

        if (password.length < 8) {
            setError(
                'Password must contain at least 8 characters.',
            );

            return;
        }

        setIsLoading(true);

        try {
            await api.post('/auth/register', {
                name,
                email,
                password,
                role,
            });

            navigate('/login', {
                state: { email },
            });
        } catch (requestError) {
            if (axios.isAxiosError(requestError)) {
                const errorMessage =
                    requestError.response?.data?.message;

                setError(
                    Array.isArray(errorMessage)
                        ? errorMessage.join(', ')
                        : errorMessage || 'Registration failed.',
                );
            } else {
                setError('Registration failed.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="register-page">
            <section className="register-page__content">
                <div className="register-page__container">
                    <Link
                        to="/login"
                        className="register-page__back"
                    >
                        ← Back to sign in
                    </Link>

                    <span className="register-page__eyebrow">
                        STEP INTO SOMETHING NEW
                    </span>

                    <h1 className="register-page__title">
                        Create your account
                    </h1>

                    <p className="register-page__description">
                        Join StepOut and discover
                        events, people and
                        experiences in your city.
                    </p>

                    <form
                        className="register-page__form"
                        onSubmit={
                            handleSubmit
                        }
                    >
                        <div className="register-page__field">
                            <label htmlFor="name">
                                Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(
                                    event,
                                ) =>
                                    setName(
                                        event.target
                                            .value,
                                    )
                                }
                                placeholder="Your name"
                                required
                            />
                        </div>

                        <div className="register-page__field">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(
                                    event,
                                ) =>
                                    setEmail(
                                        event.target
                                            .value,
                                    )
                                }
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="register-page__field">
                            <label htmlFor="role">
                                Account type
                            </label>

                            <select
                                id="role"
                                value={role}
                                onChange={(
                                    event,
                                ) =>
                                    setRole(
                                        event.target
                                            .value as
                                        | 'user'
                                        | 'organizer',
                                    )
                                }
                            >
                                <option value="user">
                                    User
                                </option>

                                <option value="organizer">
                                    Organizer
                                </option>
                            </select>
                        </div>

                        <div className="register-page__field">
                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="register-page__password">
                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={
                                        password
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setPassword(
                                            event.target
                                                .value,
                                        )
                                    }
                                    placeholder="At least 8 characters"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (
                                                previous,
                                            ) =>
                                                !previous,
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
                                            size={18}
                                        />
                                    ) : (
                                        <Eye
                                            size={18}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="register-page__field">
                            <label htmlFor="confirm-password">
                                Confirm password
                            </label>

                            <div className="register-page__password">
                                <input
                                    id="confirm-password"
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setConfirmPassword(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    placeholder="Repeat your password"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (
                                                previous,
                                            ) =>
                                                !previous,
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff
                                            size={18}
                                        />
                                    ) : (
                                        <Eye
                                            size={18}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="register-page__error">
                                {error}
                            </p>
                        )}

                        <button
                            className="register-page__submit"
                            type="submit"
                            disabled={isLoading}
                        >
                            <span>
                                {isLoading
                                    ? 'Creating account...'
                                    : 'Create account'}
                            </span>

                            {!isLoading && (
                                <ArrowRight
                                    size={18}
                                />
                            )}
                        </button>
                    </form>

                    <p className="register-page__login">
                        Already have an account?{' '}
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