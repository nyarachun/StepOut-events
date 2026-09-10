import {
    CalendarDays,
    ChevronRight,
    Heart,
    MessageCircle,
    Settings,
    UserRound,
    X,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

import './BurgerMenu.scss';

type BurgerMenuProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const BurgerMenu = ({
    isOpen,
    onClose,
}: BurgerMenuProps) => {
    const unreadMessages = 2;

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = '';
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
                    <span>Menu</span>

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
                    <a
                        className="burger-menu__link"
                        href="/favorites"
                        onClick={onClose}
                    >
                        <span className="burger-menu__link-content">
                            <Heart size={22} />

                            <span>Favorites</span>

                        </span>

                        <ChevronRight size={20} />
                    </a>

                    <a
                        className="burger-menu__link"
                        href="/messages"
                        onClick={onClose}
                    >
                        <span className="burger-menu__link-content">
                            <MessageCircle size={22} />

                            <span>Chats</span>

                            {unreadMessages > 0 && (
                                <span className="burger-menu__count">
                                    {unreadMessages}
                                </span>
                            )}
                        </span>

                        <ChevronRight size={20} />
                    </a>

                    <a
                        className="burger-menu__link"
                        href="/my-events"
                        onClick={onClose}
                    >
                        <span className="burger-menu__link-content">
                            <CalendarDays size={22} />

                            <span>My events</span>
                        </span>

                        <ChevronRight size={20} />
                    </a>

                    <a
                        className="burger-menu__link"
                        href="/settings"
                        onClick={onClose}
                    >
                        <span className="burger-menu__link-content">
                            <Settings size={22} />

                            <span>Settings</span>
                        </span>

                        <ChevronRight size={20} />
                    </a>

                    <a
                        className="burger-menu__link"
                        href="/profile"
                        onClick={onClose}
                    >
                        <span className="burger-menu__link-content">
                            <UserRound size={22} />

                            <span>Profile</span>
                        </span>

                        <ChevronRight size={20} />
                    </a>
                </nav>
            </div>
        </div>
    );

    return createPortal(menu, document.body);
};