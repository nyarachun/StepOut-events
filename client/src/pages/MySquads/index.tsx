import {
    ArrowRight,
    Check,
    Users,
} from 'lucide-react';
import {
    useEffect,
    useState,
} from 'react';
import {
    Link,
    useNavigate,
} from 'react-router-dom';

import {
    getMyChats,
    type Chat,
} from '../../api/chats';
import {
    getMySquads,
    type Squad,
} from '../../api/squads';

import './MySquads.scss';

const MySquads = () => {
    const navigate = useNavigate();

    const [squads, setSquads] =
        useState<Squad[]>([]);

    const [chats, setChats] =
        useState<Chat[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [
                    squadsData,
                    chatsData,
                ] = await Promise.all([
                    getMySquads(),
                    getMyChats(),
                ]);

                setSquads(
                    squadsData,
                );

                setChats(
                    chatsData,
                );
            } catch {
                setError(
                    'Could not load your squads.',
                );
            } finally {
                setIsLoading(false);
            }
        };

        void loadData();
    }, []);

    const findSquadChat = (
        squadId: number,
    ) => {
        return chats.find(
            (chat) =>
                chat.type ===
                    'squad' &&
                chat.squad?.id ===
                    squadId,
        );
    };

    const openSquadChat = (
        squadId: number,
    ) => {
        const chat =
            findSquadChat(squadId);

        if (chat) {
            navigate(
                `/messages?chat=${chat.id}`,
            );
        }
    };

    if (isLoading) {
        return (
            <main className="my-squads">
                <div className="my-squads__loading">
                    Loading your squads...
                </div>
            </main>
        );
    }

    return (
        <main className="my-squads">
            <div className="my-squads__container">
                <header className="my-squads__header">
                    <div>
                        <span>
                            YOUR SQUADS
                        </span>

                        <h1>
                            My squads
                        </h1>

                        <p>
                            Find your team,
                            meet new people
                            and explore
                            together.
                        </p>
                    </div>

                    <Link
                        className="my-squads__create"
                        to="/squads"
                    >
                        <Users
                            size={17}
                        />

                        Find a squad
                    </Link>
                </header>

                {error && (
                    <p className="my-squads__error">
                        {error}
                    </p>
                )}

                {!error &&
                    squads.length ===
                        0 && (
                        <div className="my-squads__empty">
                            <div className="my-squads__empty-icon">
                                <Users
                                    size={28}
                                />
                            </div>

                            <h2>
                                No squads
                                yet
                            </h2>

                            <p>
                                Choose your
                                interests and
                                preferences to
                                find people
                                for your next
                                adventure.
                            </p>

                            <Link
                                to="/squads"
                                className="my-squads__empty-button"
                            >
                                Find my squad
                                <ArrowRight
                                    size={16}
                                />
                            </Link>
                        </div>
                    )}

                {squads.length > 0 && (
                    <div className="my-squads__list">
                        {squads.map(
                            (squad) => {
                                const isFormed =
                                    squad.status ===
                                    'formed';

                                const memberCount =
                                    squad.members
                                        .length;

                                const hasChat =
                                    Boolean(
                                        findSquadChat(
                                            squad.id,
                                        ),
                                    );

                                return (
                                    <article
                                        key={
                                            squad.id
                                        }
                                        className="my-squads__card"
                                    >
                                        <div className="my-squads__top">
                                            <div>
                                                <span className="my-squads__label">
                                                    SQUAD
                                                </span>

                                                <h2>
                                                    {
                                                        squad.groupSizeMin
                                                    }
                                                    –
                                                    {
                                                        squad.groupSizeMax
                                                    }{' '}
                                                    people
                                                </h2>
                                            </div>

                                            <span
                                                className={`my-squads__status ${
                                                    isFormed
                                                        ? 'is-formed'
                                                        : 'is-open'
                                                }`}
                                            >
                                                {isFormed
                                                    ? 'Formed'
                                                    : 'Looking for members'}
                                            </span>
                                        </div>

                                        <div className="my-squads__interests">
                                            {squad.interests.map(
                                                (
                                                    interest,
                                                ) => (
                                                    <span
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

                                        <div className="my-squads__members">
                                            <div className="my-squads__members-heading">
                                                <div>
                                                    <Users
                                                        size={
                                                            17
                                                        }
                                                    />

                                                    <strong>
                                                        Members
                                                    </strong>
                                                </div>

                                                <span>
                                                    {
                                                        memberCount
                                                    }
                                                    /
                                                    {
                                                        squad.groupSizeMax
                                                    }
                                                </span>
                                            </div>

                                            <div className="my-squads__member-list">
                                                {squad.members.map(
                                                    (
                                                        member,
                                                    ) => (
                                                        <div
                                                            key={
                                                                member.id
                                                            }
                                                            className="my-squads__member"
                                                        >
                                                            <div className="my-squads__avatar">
                                                                {member.user.name
                                                                    .charAt(
                                                                        0,
                                                                    )
                                                                    .toUpperCase()}
                                                            </div>

                                                            <span>
                                                                {
                                                                    member
                                                                        .user
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        <div className="my-squads__bottom">
                                            <div className="my-squads__progress">
                                                <div>
                                                    <span>
                                                        {
                                                            memberCount
                                                        }{' '}
                                                        member
                                                        {memberCount !==
                                                        1
                                                            ? 's'
                                                            : ''}{' '}
                                                        joined
                                                    </span>

                                                    <span>
                                                        {
                                                            squad.groupSizeMin
                                                        }{' '}
                                                        needed
                                                    </span>
                                                </div>

                                                <div className="my-squads__progress-track">
                                                    <div
                                                        style={{
                                                            width: `${Math.min(
                                                                (memberCount /
                                                                    squad.groupSizeMin) *
                                                                    100,
                                                                100,
                                                            )}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {isFormed &&
                                                hasChat && (
                                                    <button
                                                        className="my-squads__chat-button"
                                                        type="button"
                                                        onClick={() =>
                                                            openSquadChat(
                                                                squad.id,
                                                            )
                                                        }
                                                    >
                                                        <Check
                                                            size={
                                                                16
                                                            }
                                                        />

                                                        Open
                                                        squad
                                                        chat
                                                    </button>
                                                )}
                                        </div>
                                    </article>
                                );
                            },
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};

export default MySquads;