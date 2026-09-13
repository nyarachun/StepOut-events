import axios from 'axios';
import {
    ArrowRight,
    Eye,
    EyeOff,
    Mail,
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
import { useTheme } from '../../context/ThemeContext';

import './ForgotPassword.scss';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [email, setEmail] =
        useState('');

    const [code, setCode] =
        useState('');

    const [newPassword, setNewPassword] =
        useState('');

    const [confirmPassword, setConfirmPassword] =
        useState('');

    const [showPassword, setShowPassword] =
        useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [step, setStep] =
        useState<'email' | 'reset'>(
            'email',
        );

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState('');

    const [message, setMessage] =
        useState('');

    const backgroundImage =
        theme === 'dark'
            ? `${import.meta.env.BASE_URL}images/background-dark.svg`
            : `${import.meta.env.BASE_URL}images/background.svg`;

    const getErrorMessage = (
        requestError: unknown,
        defaultMessage: string,
    ) => {
        if (
            axios.isAxiosError(
                requestError,
            )
        ) {
            const responseMessage =
                requestError.response
                    ?.data?.message;

            return Array.isArray(
                responseMessage,
            )
                ? responseMessage.join(
                      ', ',
                  )
                : responseMessage ||
                      defaultMessage;
        }

        return defaultMessage;
    };

    const handleSendCode = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const response =
                await api.post(
                    '/auth/forgot-password',
                    {
                        email,
                    },
                );

            setMessage(
                response.data.message,
            );

            setStep('reset');
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'Could not send reset code.',
                ),
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword =
        async (
            event: FormEvent<HTMLFormElement>,
        ) => {
            event.preventDefault();

            setError('');
            setMessage('');

            if (
                code.length !== 6
            ) {
                setError(
                    'Enter the 6-digit verification code.',
                );

                return;
            }

            if (
                newPassword.length < 8
            ) {
                setError(
                    'Password must contain at least 8 characters.',
                );

                return;
            }

            if (
                newPassword !==
                confirmPassword
            ) {
                setError(
                    'Passwords do not match.',
                );

                return;
            }

            setIsLoading(true);

            try {
                await api.post(
                    '/auth/reset-password',
                    {
                        email,
                        code,
                        newPassword,
                        confirmPassword,
                    },
                );

                navigate('/login', {
                    replace: true,
                    state: {
                        email,
                        passwordReset: true,
                    },
                });
            } catch (requestError) {
                setError(
                    getErrorMessage(
                        requestError,
                        'Could not reset password.',
                    ),
                );
            } finally {
                setIsLoading(false);
            }
        };

    const handleResend = async () => {
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const response =
                await api.post(
                    '/auth/forgot-password',
                    {
                        email,
                    },
                );

            setMessage(
                response.data.message,
            );
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'Could not resend reset code.',
                ),
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main
            className="forgot-password"
            style={{
                backgroundImage: `url("${backgroundImage}")`,
            }}
        >
            <section className="forgot-password__content">
                <div className="forgot-password__container">
                    <div className="forgot-password__icon">
                        <Mail size={28} />
                    </div>

                    <span className="forgot-password__eyebrow">
                        ACCOUNT RECOVERY
                    </span>

                    <h1 className="forgot-password__title">
                        {step === 'email'
                            ? 'Forgot password?'
                            : 'Create a new password'}
                    </h1>

                    <p className="forgot-password__description">
                        {step === 'email'
                            ? 'Enter your email and we will send you a 6-digit code to reset your password.'
                            : `We sent a reset code to ${email}. Enter it below and choose a new password.`}
                    </p>

                    {step === 'email' ? (
                        <form
                            className="forgot-password__form"
                            onSubmit={
                                handleSendCode
                            }
                        >
                            <div className="forgot-password__field">
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
                                    placeholder="myemail@email.com"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            {error && (
                                <p className="forgot-password__error">
                                    {error}
                                </p>
                            )}

                            {message && (
                                <p className="forgot-password__success">
                                    {message}
                                </p>
                            )}

                            <button
                                className="forgot-password__submit"
                                type="submit"
                                disabled={
                                    isLoading
                                }
                            >
                                <span>
                                    {isLoading
                                        ? 'Sending...'
                                        : 'Send reset code'}
                                </span>

                                {!isLoading && (
                                    <ArrowRight
                                        size={18}
                                    />
                                )}
                            </button>
                        </form>
                    ) : (
                        <form
                            className="forgot-password__form"
                            onSubmit={
                                handleResetPassword
                            }
                        >
                            <div className="forgot-password__field">
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

                            <div className="forgot-password__field">
                                <label htmlFor="new-password">
                                    New password
                                </label>

                                <div className="forgot-password__password">
                                    <input
                                        id="new-password"
                                        type={
                                            showPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={
                                            newPassword
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setNewPassword(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        placeholder="At least 8 characters"
                                        required
                                        autoComplete="new-password"
                                    />

                                    <button
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

                            <div className="forgot-password__field">
                                <label htmlFor="confirm-password">
                                    Confirm new password
                                </label>

                                <div className="forgot-password__password">
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
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (
                                                    current,
                                                ) =>
                                                    !current,
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

                            {error && (
                                <p className="forgot-password__error">
                                    {error}
                                </p>
                            )}

                            {message && (
                                <p className="forgot-password__success">
                                    {message}
                                </p>
                            )}

                            <button
                                className="forgot-password__submit"
                                type="submit"
                                disabled={
                                    isLoading
                                }
                            >
                                <span>
                                    {isLoading
                                        ? 'Resetting...'
                                        : 'Reset password'}
                                </span>

                                {!isLoading && (
                                    <ArrowRight
                                        size={18}
                                    />
                                )}
                            </button>

                            <button
                                className="forgot-password__resend"
                                type="button"
                                onClick={
                                    handleResend
                                }
                                disabled={
                                    isLoading
                                }
                            >
                                Send code again
                            </button>

                            <button
                                className="forgot-password__change-email"
                                type="button"
                                onClick={() => {
                                    setStep(
                                        'email',
                                    );
                                    setCode('');
                                    setError('');
                                    setMessage('');
                                }}
                            >
                                Change email
                            </button>
                        </form>
                    )}

                    <Link
                        className="forgot-password__back"
                        to="/login"
                    >
                        Back to sign in
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default ForgotPassword;