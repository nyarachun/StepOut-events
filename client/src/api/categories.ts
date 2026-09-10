import axios from 'axios';

export type Category = {
  id: number;
  name: string;
};

const API_URL = 'https://stepout-events.onrender.com';

export const getCategories = async () => {
  const response = await axios.get<Category[]>(
    `${API_URL}/categories`,
  );

  return response.data;
};