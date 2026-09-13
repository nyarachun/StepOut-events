import {
    ArrowRight,
    Check,
    MailCheck,
} from 'lucide-react';
import axios from 'axios';
import {
    useState,
    type FormEvent,
} from 'react';
import {
    Link,
    useLocation,
    useNavigate,
} from 'react-router-dom';

import { api } from '../../api/api';
import { useTheme } from '../../context/ThemeContext';

import './VerifyEmail.scss';

type LocationState = {
    email?: string;
};

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { theme } = useTheme();

    const locationState =
        location.state as
            | LocationState
            | null;

    const [email, setEmail] =
        useState(
            locationState?.email ||
                '',
        );

    const [code, setCode] =
        useState('');

    const [isVerifying, setIsVerifying] =
        useState(false);

    const [isResending, setIsResending] =
        useState(false);

    const [error, setError] =
        useState('');

    const [message, setMessage] =
        useState('');

    const backgroundImage =
        theme === 'dark'
            ? `${import.meta.env.BASE_URL}images/background-dark.svg`
            : `${import.meta.env.BASE_URL}images/background.svg`;

    const handleVerify = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError('');
        setMessage('');
        setIsVerifying(true);

        try {
            await api.post(
                '/auth/verify-email',
                {
                    email,
                    code,
                },
            );

            navigate('/login', {
                replace: true,
                state: {
                    email,
                    verified: true,
                },
            });
        } catch (requestError) {
            if (
                axios.isAxiosError(
                    requestError,
                )
            ) {
                const errorMessage =
                    requestError.response
                        ?.data?.message;

                setError(
                    Array.isArray(
                        errorMessage,
                    )
                        ? errorMessage.join(
                              ', ',
                          )
                        : errorMessage ||
                          'Invalid verification code.',
                );
            } else {
                setError(
                    'Could not verify your email.',
                );
            }
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (!email.trim()) {
            setError(
                'Enter your email first.',
            );

            return;
        }

        setError('');
        setMessage('');
        setIsResending(true);

        try {
            const response =
                await api.post(
                    '/auth/resend-verification',
                    {
                        email,
                    },
                );

            setMessage(
                response.data.message,
            );
        } catch (requestError) {
            if (
                axios.isAxiosError(
                    requestError,
                )
            ) {
                const errorMessage =
                    requestError.response
                        ?.data?.message;

                setError(
                    Array.isArray(
                        errorMessage,
                    )
                        ? errorMessage.join(
                              ', ',
                          )
                        : errorMessage ||
                          'Could not resend verification code.',
                );
            } else {
                setError(
                    'Could not resend verification code.',
                );
            }
        } finally {
            setIsResending(false);
        }
    };

    return (
        <main
            className="verify-email"
            style={{
                backgroundImage: `url("${backgroundImage}")`,
            }}
        >
            <section className="verify-email__content">
                <div className="verify-email__container">
                    <div className="verify-email__icon">
                        <MailCheck size={30} />
                    </div>

                    <span className="verify-email__eyebrow">
                        CHECK YOUR INBOX
                    </span>

                    <h1 className="verify-email__title">
                        Verify your email
                    </h1>

                    <p className="verify-email__description">
                        We sent a 6-digit
                        verification code to your
                        email address.
                    </p>

                    <form
                        className="verify-email__form"
                        onSubmit={
                            handleVerify
                        }
                    >
                        <div className="verify-email__field">
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
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="verify-email__field">
                            <label htmlFor="code">
                                Verification code
                            </label>

                            <input
                                id="code"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="000000"
                                value={code}
                                onChange={(
                                    event,
                                ) =>
                                    setCode(
                                        event
                                            .target
                                            .value
                                            .replace(
                                                /\D/g,
                                                '',
                                            ),
                                    )
                                }
                                required
                            />
                        </div>

                        {error && (
                            <p className="verify-email__error">
                                {error}
                            </p>
                        )}

                        {message && (
                            <p className="verify-email__success">
                                {message}
                            </p>
                        )}

                        <button
                            className="verify-email__submit"
                            type="submit"
                            disabled={
                                isVerifying
                            }
                        >
                            <span>
                                {isVerifying
                                    ? 'Verifying...'
                                    : 'Verify email'}
                            </span>

                            {isVerifying ? (
                                <Check
                                    size={18}
                                />
                            ) : (
                                <ArrowRight
                                    size={18}
                                />
                            )}
                        </button>
                    </form>

                    <button
                        className="verify-email__resend"
                        type="button"
                        onClick={
                            handleResend
                        }
                        disabled={
                            isResending
                        }
                    >
                        {isResending
                            ? 'Sending...'
                            : 'Resend code'}
                    </button>

                    <Link
                        className="verify-email__back"
                        to="/login"
                    >
                        Back to sign in
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default VerifyEmail;