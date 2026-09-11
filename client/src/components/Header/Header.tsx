import {
    ChevronDown,
    Heart,
    MapPin,
    Menu,
    MessageCircle,
    Moon,
    Search,
    Sun,
    UserRound,
    X,
} from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCity } from '../../context/CityContext';
import { useTheme } from '../../context/ThemeContext';
import { BurgerMenu } from '../BurgerMenu/BurgerMenu';

import './Header.scss';

export const Header = () => {
    const [isCityOpen, setIsCityOpen] = useState(false);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);

    const {
        cities,
        selectedCity,
        setSelectedCity,
    } = useCity();

    const {
        theme,
        toggleTheme,
    } = useTheme();

    const navigate = useNavigate();

    const unreadMessages = 2;

    const handleCitySelect = (cityId: number) => {
        const city = cities.find(
            (item) => item.id === cityId,
        );

        if (!city) {
            return;
        }

        setSelectedCity(city);
        setIsCityOpen(false);
    };

    const handleSearch = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const search = event.target.value.trimStart();

        navigate(
            search
                ? `/events?search=${encodeURIComponent(search)}`
                : '/events',
        );
    };

    return (
        <>
            <header className="header">
                <div className="header__container">
                    <a
                        className="header__logo"
                        href="/StepOut-events/"
                    >
                        StepOut
                    </a>

                    <div className="city-selector">
                        <button
                            className="city-selector__button"
                            type="button"
                            onClick={() =>
                                setIsCityOpen(!isCityOpen)
                            }
                        >
                            <MapPin size={19} />

                            <span>
                                {selectedCity?.name || 'Lviv'}
                            </span>

                            <ChevronDown
                                className={
                                    isCityOpen
                                        ? 'city-selector__arrow city-selector__arrow--open'
                                        : 'city-selector__arrow'
                                }
                                size={17}
                            />
                        </button>

                        {isCityOpen && (
                            <div className="city-selector__dropdown">
                                <div className="city-selector__header">
                                    <span>
                                        Choose your city
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsCityOpen(false)
                                        }
                                        aria-label="Close city selector"
                                    >
                                        <X size={17} />
                                    </button>
                                </div>

                                <div className="city-selector__list">
                                    {cities.map((city) => (
                                        <button
                                            className={
                                                city.id === selectedCity?.id
                                                    ? 'city-selector__city city-selector__city--selected'
                                                    : 'city-selector__city'
                                            }
                                            key={city.id}
                                            type="button"
                                            onClick={() =>
                                                handleCitySelect(
                                                    city.id,
                                                )
                                            }
                                        >
                                            <MapPin size={17} />

                                            <span>
                                                {city.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="header__search">
                        <Search size={19} />

                        <input
                            type="search"
                            placeholder="Search events..."
                            onChange={handleSearch}
                        />
                    </div>

                    <nav className="header__navigation">
                        <a
                            className="header__icon-link"
                            href="StepOut-events/#//favorites"
                            aria-label="Favorites"
                        >
                            <Heart size={21} />
                        </a>

                        <a
                            className="header__icon-link"
                            href="/messages"
                            aria-label="Messages"
                        >
                            <MessageCircle size={21} />

                            {unreadMessages > 0 && (
                                <span className="header__badge">
                                    {unreadMessages}
                                </span>
                            )}
                        </a>

                        <a
                            className="header__events-link"
                            href="/my-events"
                        >
                            <span>My events</span>
                        </a>
                    </nav>

                    <button
                        className="theme-switch"
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Change theme"
                    >
                        <span
                            className={
                                theme === 'light'
                                    ? 'theme-switch__slider theme-switch__slider--light'
                                    : 'theme-switch__slider'
                            }
                        >
                            {theme === 'dark' ? (
                                <Moon size={15} />
                            ) : (
                                <Sun size={15} />
                            )}
                        </span>
                    </button>

                    <a
                        className="header__profile"
                        href="/profile"
                        aria-label="Profile"
                    >
                        <UserRound size={20} />
                    </a>

                    <button
                        className="header__menu-button"
                        type="button"
                        onClick={() =>
                            setIsBurgerOpen(true)
                        }
                        aria-label="Open menu"
                    >
                        <Menu size={23} />

                        {unreadMessages > 0 && (
                            <span className="header__menu-badge">
                                {unreadMessages}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <BurgerMenu
                isOpen={isBurgerOpen}
                onClose={() =>
                    setIsBurgerOpen(false)
                }
            />
        </>
    );
};