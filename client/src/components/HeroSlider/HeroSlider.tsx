import { useEffect, useState } from 'react';

import './HeroSlider.scss';

const images = [
  `${import.meta.env.BASE_URL}images/hero.png`,
  `${import.meta.env.BASE_URL}images/hero-2.png`,
  `${import.meta.env.BASE_URL}images/hero-3.png`,
];

export const HeroSlider = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((current) => {
        return (current + 1) % images.length;
      });
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="hero-slider">
      {images.map((image, index) => (
        <img
          className={
            index === currentImage
              ? 'hero-slider__image hero-slider__image--active'
              : 'hero-slider__image'
          }
          key={image}
          src={image}
          alt="People enjoying a city event"
        />
      ))}
    </div>
  );
};