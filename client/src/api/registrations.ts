import { api } from './api';

export type Registration = {
    id: number;
    event: {
        id: number;
        title: string;
        description: string;
        date: string;
        address: string;
        price: number;
        capacity: number;
        imageUrl: string | null;
    };
    createdAt: string;
};

export const registerForEvent = async (
    eventId: number,
) => {
    const response =
        await api.post<Registration>(
            '/registrations',
            {
                eventId,
            },
        );

    return response.data;
};

export const getMyRegistrations =
    async () => {
        const response =
            await api.get<Registration[]>(
                '/registrations/my',
            );

        return response.data;
    };

export const getMyRegistration =
    async (
        eventId: number,
    ) => {
        const response =
            await api.get<Registration>(
                `/registrations/event/${eventId}`,
            );

        return response.data;
    };

export const cancelRegistration =
    async (
        registrationId: number,
    ) => {
        await api.delete(
            `/registrations/${registrationId}`,
        );
    };