import axios from 'axios';

import type { EventCardData } from '../components/EventCard/EventCard';

const API_URL = 'https://stepout-events.onrender.com';

type EventsResponse = {
  data: Array<
    EventCardData & {
      category?: { id: number };
      city?: { id: number };
    }
  >;
};

type GetEventsParams = {
  cityId?: number;
};

export const getEvents = async (params?: GetEventsParams) => {
  const response = await axios.get<EventsResponse>(
    `${API_URL}/events?limit=1000`,
    { params },
  );

  return response.data.data.map((event) => ({
    ...event,
    price: Number(event.price),
    imageUrl: event.imageUrl || '',
    categoryId: event.categoryId || event.category?.id || 0,
    cityId: event.cityId || event.city?.id || 0,
  }));
};