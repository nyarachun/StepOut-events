import type { City } from '../types/city';
import { api } from './api';

export const getCities = async () => {
  const response = await api.get<City[]>('/cities');

  return response.data;
};