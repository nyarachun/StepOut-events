import axios from 'axios';

import type { City } from '../types/city';

const API_URL = 'https://stepout-events.onrender.com';

export const getCities = async () => {
  const response = await axios.get<City[]>(
    `${API_URL}/cities`,
  );

  return response.data;
};