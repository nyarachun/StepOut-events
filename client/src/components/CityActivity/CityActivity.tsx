import {
  Activity,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import './CityActivity.scss';

export const CityActivity = () => {
  const [peopleCount, setPeopleCount] = useState(1420);

  useEffect(() => {
    const interval = setInterval(() => {
      setPeopleCount((currentCount) => {
        const change =
          Math.floor(Math.random() * 11) - 5;

        return Math.max(
          0,
          currentCount + change,
        );
      });
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="city-activity">
      <div className="city-activity__container">
        <div className="city-activity__top">
          <div className="city-activity__title">
            <Activity size={19} />

            <span>CITY ACTIVITY</span>
          </div>
        </div>

        <div className="city-activity__main">
          <div className="city-activity__people">
            <div className="city-activity__label">
              <span className="city-activity__dot" />

              <span>ACTIVE RIGHT NOW</span>
            </div>

            <div className="city-activity__count">
              {peopleCount.toLocaleString()}
            </div>

            <p className="city-activity__people-text">
              people are moving around the city
              tonight
            </p>
          </div>

          <div className="city-activity__location">
            <div className="city-activity__small-label">
              <MapPin size={16} />

              <span>
                HOTTEST LOCATION TONIGHT
              </span>
            </div>

            <h3>Fest Republic</h3>

            <p>City Center</p>
          </div>

          <div className="city-activity__peak">
            <div className="city-activity__small-label">
              <TrendingUp size={16} />

              <span>PEAK ACTIVITY</span>
            </div>

            <div className="city-activity__peak-time">
              21:30
            </div>

            <p>Peak party time tonight</p>
          </div>
        </div>
      </div>
    </section>
  );
};