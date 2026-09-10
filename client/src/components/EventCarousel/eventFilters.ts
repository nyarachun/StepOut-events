import type { EventCardData } from '../EventCard/EventCard';

export type EventFilters = {
    maxPrice?: number;
    categoryId?: number;
    cityId?: number;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
};

export const filterEvents = (
    events: EventCardData[],
    filters?: EventFilters,
) => {
    return events.filter((event) => {
        if (
            filters?.maxPrice !== undefined &&
            event.price > filters.maxPrice
        ) {
            return false;
        }

        if (
            filters?.categoryId !== undefined &&
            event.categoryId !== filters.categoryId
        ) {
            return false;
        }

        if (
            filters?.cityId !== undefined &&
            event.cityId !== filters.cityId
        ) {
            return false;
        }

        if (
            filters?.dateFrom &&
            new Date(event.date) < new Date(filters.dateFrom)
        ) {
            return false;
        }

        if (
            filters?.dateTo &&
            new Date(event.date) > new Date(filters.dateTo)
        ) {
            return false;
        }

        if (filters?.search) {
            const search = filters.search.toLowerCase();
            const eventTitle = event.title.toLowerCase();

            if (!eventTitle.includes(search)) {
                return false;
            }
        }

        return true;
    });
};