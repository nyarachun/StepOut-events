import type { EventCardData } from '../components/EventCard/EventCard';
import { api } from './api';

type EventsResponse = {
  data: Array<
    EventCardData & {
      category?: { id: number };
      city?: { id: number };
    }
  >;
};

export type EventItem = {
    id: number;
    title: string;
    description: string;
    date: string;
    address: string;
    price: number;
    capacity: number;
    imageUrl: string | null;
    createdAt: string;
    organizer: {
        id: number;
        name: string;
    };
    category: {
        id: number;
        name: string;
    };
    city: {
        id: number;
        name: string;
    };
    registeredCount?: number;
    availableSpots?: number;
};

export type CreateEventData = {
    title: string;
    description: string;
    date: string;
    address: string;
    price: number;
    capacity: number;
    imageUrl: string;
    categoryId: number;
    cityId: number;
};

type GetEventsParams = {
  cityId?: number;
};

export const getEvents = async (params?: GetEventsParams) => {
    const response = await api.get<EventsResponse>('/events', {
        params: { ...params, limit: 1000 },
    });

  return response.data.data.map((event) => ({
    ...event,
    price: Number(event.price),
    imageUrl: event.imageUrl || '',
    categoryId: event.categoryId || event.category?.id || 0,
    cityId: event.cityId || event.city?.id || 0,
  }));
};

export const createEvent = async (
    data: CreateEventData,
) => {
    const response = await api.post<EventItem>('/events', data);

    return response.data;
};

export const getMyEvents = async () => {
    const response = await api.get<EventItem[]>('/events/my');

    return response.data;
};

export const updateEvent = async (
    id: number,
    data: CreateEventData,
) => {
    const response = await api.patch<EventItem>(`/events/${id}`, data);

    return response.data;
};

export const deleteEvent = async (
    id: number,
) => {
    await api.delete(`/events/${id}`);
};