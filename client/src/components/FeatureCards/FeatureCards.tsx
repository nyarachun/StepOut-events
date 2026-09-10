import {
  Search,
  Users,
  UserPlus,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import './FeatureCards.scss';

type FeatureId =
  | 'interests'
  | 'squad'
  | 'organizer';

type Feature = {
  id: FeatureId;
  title: string;
  teaser: string;
  description: string;
  buttonText: string;
  icon: typeof Search;
  image: string;
};

const features: Feature[] = [
  {
    id: 'interests',
    title: 'SEARCH BY INTERESTS',
    teaser:
      'Find events that match what you actually enjoy.',
    description:
      'Choose your interests and use simple filters to discover events that fit your preferences, date and city. Spend less time searching and more time finding something worth stepping out for.',
    buttonText: 'VIEW EVENTS',
    icon: Search,
    image: `${import.meta.env.BASE_URL}images/interests.png`,
  },
  {
    id: 'squad',
    title: 'YOUR SQUAD',
    teaser:
      'Find people with similar interests and join the same event.',
    description:
      'StepOut can help you connect with people who share similar interests and are looking for the same kind of experience. Before an event, participants can be grouped into a shared chat so it is easier to meet new people and go together.',
    buttonText: 'FIND YOUR SQUAD',
    icon: Users,
    image: `${import.meta.env.BASE_URL}images/company.png`,
  },
  {
    id: 'organizer',
    title: 'BECOME AN ORGANIZER',
    teaser:
      'Create events, reach your audience and grow your community.',
    description:
      'Organizers can create and manage their own events, add important details, choose a location and reach people who are interested in their topic. It is a simple way to turn an idea into an actual event.',
    buttonText: 'BECOME AN ORGANIZER',
    icon: UserPlus,
    image: `${import.meta.env.BASE_URL}images/organizator.png`,
  },
];

export const FeatureCards = () => {
  const [selectedFeature, setSelectedFeature] =
    useState<Feature | null>(null);

  useEffect(() => {
    if (!selectedFeature) {
      document.body.style.overflow = '';

      return;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedFeature]);

  const closeModal = () => {
    setSelectedFeature(null);
  };

  return (
    <section className="feature-cards">
      <div className="feature-cards__container">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <button
              className="feature-card"
              type="button"
              key={feature.id}
              onClick={() => setSelectedFeature(feature)}
            >
              <span className="feature-card__icon">
                <Icon size={28} />
              </span>

              <span className="feature-card__title">
                {feature.title}
              </span>

              <span className="feature-card__teaser">
                {feature.teaser}
              </span>
            </button>
          );
        })}
      </div>

      {selectedFeature && (
        <div className="feature-modal">
          <div
            className="feature-modal__overlay"
            onClick={closeModal}
          />

          <div
            className="feature-modal__window"
            role="dialog"
            aria-modal="true"
            aria-labelledby="feature-modal-title"
          >
            <button
              className="feature-modal__close"
              type="button"
              onClick={closeModal}
              aria-label="Close"
            >
              <X size={22} />
            </button>

            <div className="feature-modal__header">
              <h2 id="feature-modal-title">
                {selectedFeature.title}
              </h2>
            </div>

            <div className="feature-modal__content">
              <img
                className="feature-modal__image"
                src={selectedFeature.image}
                alt={selectedFeature.title}
              />

              <p className="feature-modal__description">
                {selectedFeature.description}
              </p>

              <button
                className="feature-modal__action"
                type="button"
                onClick={closeModal}
              >
                {selectedFeature.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};