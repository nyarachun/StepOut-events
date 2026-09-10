import {
    ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CityActivity } from '../../components/CityActivity/CityActivity';
import { EventRoulette } from '../../components/EventRoulette/EventRoulette';
import { FeatureCards } from '../../components/FeatureCards/FeatureCards';
import { HeroSlider } from '../../components/HeroSlider/HeroSlider';

import './Home.scss';

const Home = () => {
    return (
        <div className="home">
            <section className="home-hero">
                <div className="home-hero__container">
                    <div className="home-hero__content">
                        <span className="home-hero__eyebrow">
                            YOUR CITY. YOUR PEOPLE. YOUR PLANS.
                        </span>

                        <h1 className="home-hero__title">
                            Find something worth
                            <br />
                            stepping out for.
                        </h1>

                        <p className="home-hero__description">
                            StepOut helps you discover local events,
                            meet people with similar interests and
                            find someone to go with when you do not
                            want another boring evening.
                        </p>

                        <Link
                            className="home-hero__button"
                            to="/events"
                        >
                            <span>EXPLORE EVENTS</span>
                            <ArrowRight size={18} />
                        </Link>

                    </div>

                    <div className="home-hero__image">
                        <HeroSlider />
                    </div>
                </div>
            </section>

            <CityActivity />

            <section className="home-features">
                <div className="home-section-heading">
                    <div>
                        <span className="home-section-heading__eyebrow">
                            WHAT YOU CAN DO
                        </span>

                        <h2 className="home-section-heading__title">
                            More than just events.
                        </h2>
                    </div>

                    <p className="home-section-heading__description">
                        Discover experiences, find your people and
                        turn a random evening into a good story.
                    </p>
                </div>

                <FeatureCards />
            </section>
            <div className="divider" />

            <section className="home-city">
                <div className="home-city__container">
                    <div className="home-city__content">

                        <span className="home-city__eyebrow">
                            MADE FOR YOUR CITY
                        </span>

                        <h2 className="home-city__title">
                            There is always
                            <br />
                            something happening.
                        </h2>

                        <p className="home-city__text">
                            From concerts and food festivals to
                            workshops, sports and late-night plans.
                            StepOut brings local events together in
                            one place so you can spend less time
                            searching and more time actually going out.
                        </p>

                        <Link
                            className="home-city__location"
                            to="/events"
                        >
                            <span>
                                Explore events in your city
                            </span>

                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    <div className="home-city__images">
                        <img
                            src={`${import.meta.env.BASE_URL}images/city-main.png`}
                            alt="People enjoying a city event"
                        />

                        <img
                            src={`${import.meta.env.BASE_URL}images/city-small.png`}
                            alt="People spending time together"
                        />
                    </div>
                </div>
            </section>

            <div className="divider" />
            <div className="divider" />
            <EventRoulette />

            <section className="home-cta">
                <div className="home-cta__container">
                    <div>
                        <span className="home-cta__eyebrow">
                            DON'T HAVE ANYONE TO GO WITH?
                        </span>

                        <h2 className="home-cta__title">
                            Find your people
                            <br />
                            and build your squad.
                        </h2>

                        <p className="home-cta__text">
                            Tell us what you are into and find people
                            with similar interests who are looking for
                            someone to join the same events.
                        </p>
                    </div>

                    <Link
                        className="home-cta__button"
                        to="/squads"
                    >
                        <span>FIND A SQUAD</span>

                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;