import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { getCities } from '../api/cities';
import type { City } from '../types/city';

type CityContextType = {
  cities: City[];
  selectedCity: City | null;
  setSelectedCity: (city: City) => void;
};

const CityContext = createContext<CityContextType | null>(null);

type CityProviderProps = {
  children: ReactNode;
};

export const CityProvider = ({ children }: CityProviderProps) => {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCityState] = useState<City | null>(null);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const data = await getCities();
        console.log('Cities from API:', data);

        setCities(data);

        const savedCityId = localStorage.getItem('selectedCityId');

        const savedCity = data.find((city) => city.id === Number(savedCityId));

        const defaultCity =
          savedCity || data.find((city) => city.name === 'Lviv');

        if (defaultCity) {
          setSelectedCityState(defaultCity);
        }
      } catch (error) {
        console.error('Failed to load cities', error);
      }
    };

    loadCities();
  }, []);

  const setSelectedCity = (city: City) => {
    setSelectedCityState(city);

    localStorage.setItem('selectedCityId', String(city.id));
  };

  return (
    <CityContext.Provider
      value={{
        cities,
        selectedCity,
        setSelectedCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCity = () => {
  const context = useContext(CityContext);

  if (!context) {
    throw new Error('useCity must be used inside CityProvider');
  }

  return context;
};
