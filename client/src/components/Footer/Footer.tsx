import {
  ArrowUp,
  Mail,
  Phone,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import './Footer.scss';

const githubUrl =
  'https://github.com/nyarachun/StepOut-events';

export const Footer = () => {
  const handleGoToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link
              className="footer__logo"
              to="/"
            >
              StepOut
            </Link>

            <p className="footer__description">
              Discover events, meet people and find
              something worth stepping out for.
            </p>
          </div>

          <div className="footer__column">
            <h3>Have a question?</h3>

            <a
              className="footer__contact"
              href="tel:+11111111111"
            >
              <Phone size={17} />
              <span>+1 (111) 111-1111</span>
            </a>

            <a
              className="footer__contact"
              href="mailto:hello@stepout-app.dev"
            >
              <Mail size={17} />
              <span>hello@stepout-app.dev</span>
            </a>
          </div>

          <div className="footer__column">
            <h3>Project</h3>

            <a
              className="footer__contact"
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.23.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.23-3.37-1.23-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.08 1.53 1.08.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.2 9.2 0 0 1 12 7.91c.85 0 1.7.12 2.49.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.6.69.49A10.27 10.27 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
              </svg>

              <span>GitHub</span>
            </a>

            <Link to="/rights">
              Rights & Terms of Use
            </Link>
          </div>
        </div>

        <div className="footer__bottom">
          <button
            className="footer__top-button"
            type="button"
            onClick={handleGoToTop}
          >
            <span>Go to top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};