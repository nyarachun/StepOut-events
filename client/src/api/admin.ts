import { api } from './api';
import type { EventItem } from './events';

export type BanEventData = {
    reason: string;
};

export const getAdminEvents =
    async () => {
        const response =
            await api.get<EventItem[]>(
                '/admin/events',
            );

        return response.data;
    };

export const banEvent = async (
    eventId: number,
    data: BanEventData,
) => {
    const response =
        await api.post(
            `/admin/events/${eventId}/ban`,
            data,
        );

    return response.data;
};