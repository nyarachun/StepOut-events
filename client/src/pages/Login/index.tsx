import {
    ArrowRight,
    Check,
    Eye,
    EyeOff,
} from 'lucide-react';
import axios from 'axios';
import {
    useState,
} from 'react';
import type { FormEvent } from 'react';
import {
    Link,
    useNavigate,
} from 'react-router-dom';

import './Login.scss';

const API_URL = 'http://localhost:3000';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
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
            const response = await axios.post(
                `${API_URL}/auth/login`,
                {
                    email,
                    password,
                },
            );

            const token =
                response.data.access_token;

            const storage = rememberMe
                ? localStorage
                : sessionStorage;

            storage.setItem(
                'accessToken',
                token,
            );

            navigate('/');
        } catch (requestError) {
            if (
                axios.isAxiosError(
                    requestError,
                )
            ) {
                setError(
                    requestError.response?.data
                        ?.message ||
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
            <section className="login__top">
                <div className="login__top-content" />

                <svg
                    className="login__wave"
                    viewBox="0 0 1440 260"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path
                        d="
                            M0 170
                            C180 150 300 205 480 185
                            C675 164 790 72 965 92
                            C1135 112 1240 178 1440 118
                            L1440 260
                            L0 260
                            Z
                        "
                    />
                </svg>
            </section>

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
                        onSubmit={handleSubmit}
                    >
                        <div className="login__field">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="myemail@email.com"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value,
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
                                    name="password"
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="enter your password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(
                                            event.target.value,
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

                        <div className="login__actions">
                            <label className="login__remember">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(event) =>
                                        setRememberMe(
                                            event.target
                                                .checked,
                                        )
                                    }
                                />

                                <span className="login__checkbox">
                                    <Check size={12} />
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
                            disabled={isLoading}
                        >
                            <span>
                                {isLoading
                                    ? 'Logging in...'
                                    : 'Log in'}
                            </span>

                            {!isLoading && (
                                <ArrowRight
                                    size={18}
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