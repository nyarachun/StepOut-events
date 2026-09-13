import {
    Award,
    Edit3,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Save,
    X,
} from 'lucide-react';
import {
    useState,
} from 'react';
import {
    Link,
} from 'react-router-dom';

import {
    getMyAchievements,
} from '../../api/achievements';
import {
    changeMyPassword,
    getMyProfile,
    updateMyProfile,
    type UserProfile,
} from '../../api/users';
import { interests } from '../../data/interests';
import { useEffect } from 'react';
import { profileSchema } from '../../schemas/profileSchema';
import { changePasswordSchema } from '../../schemas/changePasswordSchema';

import './Profile.scss';

const Profile = () => {
    const [profile, setProfile] =
        useState<UserProfile | null>(
            null,
        );

    const [
        achievementData,
        setAchievementData,
    ] = useState<
        Awaited<
            ReturnType<
                typeof getMyAchievements
            >
        >
    >({
        earned: [],
        all: [],
    });

    const [isEditing, setIsEditing] =
        useState(false);

    const [isChangingPassword, setIsChangingPassword] =
        useState(false);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);

    const [isPasswordSaving, setIsPasswordSaving] =
        useState(false);

    const [error, setError] =
        useState('');

    const [passwordError, setPasswordError] =
        useState('');

    const [passwordMessage, setPasswordMessage] =
        useState('');

    const [
        showCurrentPassword,
        setShowCurrentPassword,
    ] = useState(false);

    const [
        showNewPassword,
        setShowNewPassword,
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        bio: '',
        interests: [] as string[],
    });

    const [
        passwordForm,
        setPasswordForm,
    ] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const [
                    profileData,
                    achievements,
                ] = await Promise.all([
                    getMyProfile(),
                    getMyAchievements(),
                ]);

                setProfile(profileData);

                setAchievementData(
                    achievements,
                );

                setForm({
                    name: profileData.name,
                    email: profileData.email,
                    bio:
                        profileData.bio ||
                        '',
                    interests:
                        profileData.interests ||
                        [],
                });
            } catch {
                setError(
                    'Failed to load profile.',
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleEdit = () => {
        if (!profile) {
            return;
        }

        setForm({
            name: profile.name,
            email: profile.email,
            bio: profile.bio || '',
            interests:
                profile.interests || [],
        });

        setError('');
        setPasswordError('');
        setPasswordMessage('');
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (!profile) {
            return;
        }

        setForm({
            name: profile.name,
            email: profile.email,
            bio: profile.bio || '',
            interests:
                profile.interests || [],
        });

        setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });

        setIsChangingPassword(false);
        setError('');
        setPasswordError('');
        setPasswordMessage('');
        setIsEditing(false);
    };

    const handleInputChange = (
        field:
            | 'name'
            | 'email'
            | 'bio',
        value: string,
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handlePasswordChange = (
        field:
            | 'currentPassword'
            | 'newPassword'
            | 'confirmPassword',
        value: string,
    ) => {
        setPasswordForm(
            (current) => ({
                ...current,
                [field]: value,
            }),
        );
    };

    const toggleInterest = (
        interest: string,
    ) => {
        setForm((current) => {
            const isSelected =
                current.interests.includes(
                    interest,
                );

            if (isSelected) {
                return {
                    ...current,
                    interests:
                        current.interests.filter(
                            (item) =>
                                item !==
                                interest,
                        ),
                };
            }

            return {
                ...current,
                interests: [
                    ...current.interests,
                    interest,
                ],
            };
        });
    };

    const handleSave = async () => {
        if (!profile) {
            return;
        }

        setError('');

        const validation =
            profileSchema.safeParse(form);

        if (!validation.success) {
            setError(
                validation.error.issues[0]
                    .message,
            );

            return;
        }

        setIsSaving(true);

        try {
            const updatedProfile =
                await updateMyProfile(
                    profile.id,
                    validation.data,
                );

            setProfile(
                updatedProfile,
            );

            setForm({
                name: updatedProfile.name,
                email:
                    updatedProfile.email,
                bio:
                    updatedProfile.bio ||
                    '',
                interests:
                    updatedProfile.interests ||
                    [],
            });

            setError('');
        } catch {
            setError(
                'Failed to update profile.',
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordSave =
        async () => {
            if (!profile) {
                return;
            }

            setPasswordError('');
            setPasswordMessage('');

            const validation =
                changePasswordSchema.safeParse(
                    passwordForm,
                );

            if (!validation.success) {
                setPasswordError(
                    validation.error
                        .issues[0].message,
                );

                return;
            }

            setIsPasswordSaving(
                true,
            );

            try {
                await changeMyPassword(
                    profile.id,
                    validation.data,
                );

                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });

                setPasswordMessage(
                    'Password changed successfully.',
                );
            } catch (requestError) {
                const message =
                    (
                        requestError as {
                            response?: {
                                data?: {
                                    message?: string;
                                };
                            };
                        }
                    ).response?.data
                        ?.message;

                setPasswordError(
                    message ||
                        'Failed to change password.',
                );
            } finally {
                setIsPasswordSaving(
                    false,
                );
            }
        };

    if (isLoading) {
        return (
            <main className="profile-page">
                <div className="profile-page__loading">
                    Loading profile...
                </div>
            </main>
        );
    }

    if (!profile) {
        return (
            <main className="profile-page">
                <div className="profile-page__state">
                    <p className="profile-page__state-error">
                        {error ||
                            'Profile not found.'}
                    </p>
                </div>
            </main>
        );
    }

    const visibleAchievements =
        achievementData.earned.slice(
            0,
            4,
        );

    return (
        <main className="profile-page">
            <div className="profile-page__container">
                <section className="profile-page__hero">
                    <div className="profile-page__identity">
                        <div className="profile-page__avatar">
                            {profile.name
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="profile-page__main-info">
                            <span className="profile-page__role">
                                {profile.role}
                            </span>

                            <h1 className="profile-page__name">
                                {profile.name}
                            </h1>

                            <div className="profile-page__email">
                                <Mail size={15} />

                                <span>
                                    {
                                        profile.email
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {!isEditing && (
                        <button
                            className="profile-page__edit-button"
                            type="button"
                            onClick={
                                handleEdit
                            }
                        >
                            <Edit3
                                size={17}
                            />

                            <span>
                                Edit profile
                            </span>
                        </button>
                    )}
                </section>

                {isEditing ? (
                    <section className="profile-page__edit-card">
                        <div className="profile-page__section-header">
                            <div>
                                <span className="profile-page__section-label">
                                    PROFILE SETTINGS
                                </span>

                                <h2>
                                    Edit your profile
                                </h2>
                            </div>

                            <button
                                className="profile-page__cancel-button"
                                type="button"
                                onClick={
                                    handleCancel
                                }
                            >
                                <X size={17} />

                                <span>
                                    Cancel
                                </span>
                            </button>
                        </div>

                        <div className="profile-page__form">
                            <div className="profile-page__field">
                                <label htmlFor="profile-name">
                                    Name
                                </label>

                                <input
                                    id="profile-name"
                                    type="text"
                                    value={
                                        form.name
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        handleInputChange(
                                            'name',
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                />
                            </div>

                            <div className="profile-page__field">
                                <label htmlFor="profile-email">
                                    Email
                                </label>

                                <input
                                    id="profile-email"
                                    type="email"
                                    value={
                                        form.email
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        handleInputChange(
                                            'email',
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                />
                            </div>

                            <div className="profile-page__field">
                                <label htmlFor="profile-bio">
                                    Bio
                                </label>

                                <textarea
                                    id="profile-bio"
                                    rows={4}
                                    value={
                                        form.bio
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        handleInputChange(
                                            'bio',
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    placeholder="Tell people a little about yourself..."
                                />
                            </div>

                            <div className="profile-page__field">
                                <div className="profile-page__field-heading">
                                    <label>
                                        Interests
                                    </label>

                                    <span>
                                        {
                                            form
                                                .interests
                                                .length
                                        }{' '}
                                        / 10
                                    </span>
                                </div>

                                <div className="profile-page__interest-list">
                                    {interests.map(
                                        (
                                            interest,
                                        ) => {
                                            const isSelected =
                                                form.interests.includes(
                                                    interest,
                                                );

                                            return (
                                                <button
                                                    className={
                                                        isSelected
                                                            ? 'profile-page__interest profile-page__interest--selected'
                                                            : 'profile-page__interest'
                                                    }
                                                    key={
                                                        interest
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        toggleInterest(
                                                            interest,
                                                        )
                                                    }
                                                >
                                                    {
                                                        interest
                                                    }
                                                </button>
                                            );
                                        },
                                    )}
                                </div>
                            </div>

                            {error && (
                                <p className="profile-page__form-error">
                                    {error}
                                </p>
                            )}

                            <button
                                className="profile-page__save-button"
                                type="button"
                                onClick={
                                    handleSave
                                }
                                disabled={
                                    isSaving
                                }
                            >
                                <Save
                                    size={17}
                                />

                                <span>
                                    {isSaving
                                        ? 'Saving...'
                                        : 'Save changes'}
                                </span>
                            </button>
                        </div>

                        <div className="profile-page__password-section">
                            <div className="profile-page__password-header">
                                <div>
                                    <span className="profile-page__section-label">
                                        SECURITY
                                    </span>

                                    <h2>
                                        Password
                                    </h2>

                                    <p>
                                        Change your
                                        password using
                                        your current
                                        password for
                                        confirmation.
                                    </p>
                                </div>

                                {!isChangingPassword && (
                                    <button
                                        className="profile-page__password-toggle-button"
                                        type="button"
                                        onClick={() => {
                                            setIsChangingPassword(
                                                true,
                                            );
                                            setPasswordError(
                                                '',
                                            );
                                            setPasswordMessage(
                                                '',
                                            );
                                        }}
                                    >
                                        <LockKeyhole
                                            size={16}
                                        />

                                        <span>
                                            Change password
                                        </span>
                                    </button>
                                )}
                            </div>

                            {isChangingPassword && (
                                <div className="profile-page__password-form">
                                    <div className="profile-page__field">
                                        <label htmlFor="current-password">
                                            Current password
                                        </label>

                                        <div className="profile-page__password-input">
                                            <input
                                                id="current-password"
                                                type={
                                                    showCurrentPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={
                                                    passwordForm.currentPassword
                                                }
                                                onChange={(
                                                    event,
                                                ) =>
                                                    handlePasswordChange(
                                                        'currentPassword',
                                                        event
                                                            .target
                                                            .value,
                                                    )
                                                }
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowCurrentPassword(
                                                        (
                                                            current,
                                                        ) =>
                                                            !current,
                                                    )
                                                }
                                                aria-label={
                                                    showCurrentPassword
                                                        ? 'Hide current password'
                                                        : 'Show current password'
                                                }
                                            >
                                                {showCurrentPassword ? (
                                                    <EyeOff
                                                        size={
                                                            17
                                                        }
                                                    />
                                                ) : (
                                                    <Eye
                                                        size={
                                                            17
                                                        }
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="profile-page__field">
                                        <label htmlFor="new-password">
                                            New password
                                        </label>

                                        <div className="profile-page__password-input">
                                            <input
                                                id="new-password"
                                                type={
                                                    showNewPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={
                                                    passwordForm.newPassword
                                                }
                                                onChange={(
                                                    event,
                                                ) =>
                                                    handlePasswordChange(
                                                        'newPassword',
                                                        event
                                                            .target
                                                            .value,
                                                    )
                                                }
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        (
                                                            current,
                                                        ) =>
                                                            !current,
                                                    )
                                                }
                                                aria-label={
                                                    showNewPassword
                                                        ? 'Hide new password'
                                                        : 'Show new password'
                                                }
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff
                                                        size={
                                                            17
                                                        }
                                                    />
                                                ) : (
                                                    <Eye
                                                        size={
                                                            17
                                                        }
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="profile-page__field">
                                        <label htmlFor="confirm-password">
                                            Confirm new password
                                        </label>

                                        <div className="profile-page__password-input">
                                            <input
                                                id="confirm-password"
                                                type={
                                                    showConfirmPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={
                                                    passwordForm.confirmPassword
                                                }
                                                onChange={(
                                                    event,
                                                ) =>
                                                    handlePasswordChange(
                                                        'confirmPassword',
                                                        event
                                                            .target
                                                            .value,
                                                    )
                                                }
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
                                                        ? 'Hide confirmed password'
                                                        : 'Show confirmed password'
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff
                                                        size={
                                                            17
                                                        }
                                                    />
                                                ) : (
                                                    <Eye
                                                        size={
                                                            17
                                                        }
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {passwordError && (
                                        <p className="profile-page__form-error">
                                            {
                                                passwordError
                                            }
                                        </p>
                                    )}

                                    {passwordMessage && (
                                        <p className="profile-page__form-success">
                                            {
                                                passwordMessage
                                            }
                                        </p>
                                    )}

                                    <div className="profile-page__password-actions">
                                        <button
                                            className="profile-page__save-button"
                                            type="button"
                                            onClick={
                                                handlePasswordSave
                                            }
                                            disabled={
                                                isPasswordSaving
                                            }
                                        >
                                            <Save
                                                size={
                                                    17
                                                }
                                            />

                                            <span>
                                                {isPasswordSaving
                                                    ? 'Changing...'
                                                    : 'Change password'}
                                            </span>
                                        </button>

                                        <button
                                            className="profile-page__password-cancel"
                                            type="button"
                                            onClick={() => {
                                                setIsChangingPassword(
                                                    false,
                                                );

                                                setPasswordForm(
                                                    {
                                                        currentPassword:
                                                            '',
                                                        newPassword:
                                                            '',
                                                        confirmPassword:
                                                            '',
                                                    },
                                                );

                                                setPasswordError(
                                                    '',
                                                );

                                                setPasswordMessage(
                                                    '',
                                                );
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                ) : (
                    <>
                        <section className="profile-page__about-card">
                            <span className="profile-page__section-label">
                                ABOUT
                            </span>

                            <p>
                                {profile.bio ||
                                    'Tell people a little about yourself.'}
                            </p>
                        </section>

                        <section className="profile-page__section">
                            <div className="profile-page__section-header">
                                <div>
                                    <span className="profile-page__section-label">
                                        INTERESTS
                                    </span>

                                    <h2>
                                        What you are into
                                    </h2>
                                </div>
                            </div>

                            {profile.interests.length >
                            0 ? (
                                <div className="profile-page__interest-list">
                                    {profile.interests.map(
                                        (
                                            interest,
                                        ) => (
                                            <span
                                                className="profile-page__interest profile-page__interest--selected"
                                                key={
                                                    interest
                                                }
                                            >
                                                {
                                                    interest
                                                }
                                            </span>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <p className="profile-page__empty">
                                    No interests added
                                    yet.
                                </p>
                            )}
                        </section>

                        <section className="profile-page__section">
                            <div className="profile-page__section-header">
                                <div>
                                    <span className="profile-page__section-label">
                                        ACHIEVEMENTS
                                    </span>

                                    <h2>
                                        Your achievements
                                    </h2>
                                </div>

                                <Link
                                    className="profile-page__all-link"
                                    to="/achievements"
                                >
                                    <span>
                                        View all
                                    </span>

                                    <span>
                                        →
                                    </span>
                                </Link>
                            </div>

                            {visibleAchievements.length >
                            0 ? (
                                <div className="profile-page__achievements">
                                    {visibleAchievements.map(
                                        (
                                            achievement,
                                        ) => (
                                            <article
                                                className="profile-page__achievement"
                                                key={
                                                    achievement.id
                                                }
                                            >
                                                <div className="profile-page__achievement-icon">
                                                    <Award
                                                        size={
                                                            21
                                                        }
                                                    />
                                                </div>

                                                <div className="profile-page__achievement-content">
                                                    <strong>
                                                        {
                                                            achievement.title
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            achievement.description
                                                        }
                                                    </span>
                                                </div>
                                            </article>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <p className="profile-page__empty">
                                    Complete your first
                                    activity to earn an
                                    achievement.
                                </p>
                            )}
                        </section>
                    </>
                )}
            </div>
        </main>
    );
};

export default Profile;