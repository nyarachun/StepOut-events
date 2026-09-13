import {
    Award,
    Lock,
} from 'lucide-react';
import {
    useEffect,
    useState,
} from 'react';
import { Link } from 'react-router-dom';

import {
    getMyAchievements,
    type UserAchievement,
} from '../../api/achievements';

import './Achievements.scss';

type AchievementsData = {
    earned: UserAchievement[];
    all: UserAchievement[];
};

const Achievements = () => {
    const [
        achievementData,
        setAchievementData,
    ] = useState<AchievementsData>({
        earned: [],
        all: [],
    });

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    useEffect(() => {
        const loadAchievements =
            async () => {
                try {
                    const data =
                        await getMyAchievements();

                    setAchievementData(data);
                } catch {
                    setError(
                        'Failed to load achievements.',
                    );
                } finally {
                    setIsLoading(false);
                }
            };

        loadAchievements();
    }, []);

    const earnedCount =
        achievementData.earned.length;

    const totalCount =
        achievementData.all.length;

    const progress =
        totalCount > 0
            ? (earnedCount / totalCount) * 100
            : 0;

    return (
        <main className="achievements-page">
            <div className="achievements-page__container">
                <Link
                    className="achievements-page__back"
                    to="/profile"
                >
                    ← Back to profile
                </Link>

                <section className="achievements-page__intro">
                    <span className="achievements-page__eyebrow">
                        YOUR PROGRESS
                    </span>

                    <h1 className="achievements-page__title">
                        All achievements
                    </h1>

                    <p className="achievements-page__description">
                        Explore everything you can
                        unlock by discovering events,
                        saving favorites and being
                        active in the StepOut
                        community.
                    </p>

                    {!isLoading && !error && (
                        <div className="achievements-page__progress">
                            <div className="achievements-page__progress-header">
                                <span>
                                    {earnedCount} of{' '}
                                    {totalCount}{' '}
                                    achievements
                                    earned
                                </span>
                            </div>

                            <div className="achievements-page__progress-bar">
                                <div
                                    className="achievements-page__progress-value"
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </section>

                {isLoading && (
                    <div className="achievements-page__state">
                        Loading achievements...
                    </div>
                )}

                {!isLoading && error && (
                    <div className="achievements-page__state">
                        <p>
                            {error}
                        </p>
                    </div>
                )}

                {!isLoading &&
                    !error &&
                    achievementData.all.length >
                        0 && (
                        <section className="achievements-page__grid">
                            {achievementData.all.map(
                                (
                                    achievement,
                                ) => (
                                    <article
                                        className={
                                            achievement.earned
                                                ? 'achievement-card achievement-card--earned'
                                                : 'achievement-card achievement-card--locked'
                                        }
                                        key={
                                            achievement.id
                                        }
                                    >
                                        <div className="achievement-card__icon">
                                            {achievement.earned ? (
                                                <Award
                                                    size={
                                                        24
                                                    }
                                                />
                                            ) : (
                                                <Lock
                                                    size={
                                                        20
                                                    }
                                                />
                                            )}
                                        </div>

                                        <div className="achievement-card__content">
                                            <span className="achievement-card__status">
                                                {achievement.earned
                                                    ? 'EARNED'
                                                    : 'LOCKED'}
                                            </span>

                                            <h2>
                                                {
                                                    achievement.title
                                                }
                                            </h2>

                                            <p>
                                                {
                                                    achievement.description
                                                }
                                            </p>
                                        </div>
                                    </article>
                                ),
                            )}
                        </section>
                    )}

                {!isLoading &&
                    !error &&
                    achievementData.all.length ===
                        0 && (
                        <div className="achievements-page__state">
                            <p>
                                No achievements
                                available yet.
                            </p>
                        </div>
                    )}
            </div>
        </main>
    );
};

export default Achievements;