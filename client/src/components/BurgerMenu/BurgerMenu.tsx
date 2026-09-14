import {
    CalendarDays,
    ChevronRight,
    Heart,
    MessageCircle,
    UserRound,
    Users,
    X,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useChat } from '../../context/useChat';

import './BurgerMenu.scss';

type BurgerMenuProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const BurgerMenu = ({
    isOpen,
    onClose,
}: BurgerMenuProps) => {
    const { unreadCount } = useChat();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow =
                'hidden';
        }

        return () => {
            document.body.style.overflow =
                '';
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const menu = (
        <div
            className="burger-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
        >
            <div className="burger-menu__panel">
                <div className="burger-menu__header">
                    <span>
                        Menu
                    </span>

                    <button
                        className="burger-menu__close"
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="burger-menu__navigation">
                    <Link
                        className="burger-menu__link"
                        to="/favorites"
                        onClick={onClose}
                    >
                        <span className="burger-menu__link-content">
                            <Heart size={22} />

                            <span>
                                Favorites
                            </span>
                        </span>

                        <ChevronRight
                            size={20}
                        />
                    </Link>

                    <Link
                        className="burger-menu__link"
                        to="/messages"
                        onClick={onClose}
                    >
                        <span className="burger-menu__link-content">
                            <MessageCircle
                                size={22}
                            />

                            <span>
                                Chats
                            </span>

                            {unreadCount >
                                0 && (
                                    <span className="burger-menu__count">
                                        {unreadCount > 99
                                            ? '99+'
                                            : unreadCount}
                                    </span>
                                )}
                        </span>

                        <ChevronRight
                            size={20}
                        />
                    </Link>

                    <Link
                        className="burger-menu__link"
                        to="/my-events"
                        onClick={onClose}
                    >
                        <span className="burger-menu__link-content">
                            <CalendarDays
                                size={22}
                            />

                            <span>
                                My events
                            </span>
                        </span>

                        <ChevronRight
                            size={20}
                        />
                    </Link>

                    <Link
                        className="burger-menu__link"
                        to="/squads"
                        onClick={onClose}
                    >
                        <span className="burger-menu__link-content">
                            <Users size={22} />

                            <span>
                                Squads
                            </span>
                        </span>

                        <ChevronRight
                            size={20}
                        />
                    </Link>

                    <Link
                        className="burger-menu__link"
                        to="/my-squads"
                        onClick={onClose}
                    >
                        <span className="burger-menu__link-content">
                            <Users size={22} />

                            <span>
                                My squads
                            </span>
                        </span>

                        <ChevronRight
                            size={20}
                        />
                    </Link>

                    <Link
                        className="burger-menu__link"
                        to="/profile"
                        onClick={onClose}
                    >
                        <span className="burger-menu__link-content">
                            <UserRound
                                size={22}
                            />

                            <span>
                                Profile
                            </span>
                        </span>

                        <ChevronRight
                            size={20}
                        />
                    </Link>

                </nav>
            </div>
        </div>
    );

    return createPortal(
        menu,
        document.body,
    );
};