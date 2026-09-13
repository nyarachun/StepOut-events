export type Achievement = {
    id: string;
    title: string;
    description: string;
    icon: string;
};

export const achievements: Achievement[] = [
    {
        id: 'first-step',
        title: 'First Step',
        description:
            'Register for your first event',
        icon: 'footprints',
    },
    {
        id: 'explorer',
        title: 'Explorer',
        description:
            'Register for 5 events',
        icon: 'compass',
    },
    {
        id: 'regular',
        title: 'Regular',
        description:
            'Register for 10 events',
        icon: 'calendar-check',
    },
    {
        id: 'favorite-hunter',
        title: 'Favorite Hunter',
        description:
            'Add 5 events to favorites',
        icon: 'heart',
    },
    {
        id: 'social-explorer',
        title: 'Social Explorer',
        description:
            'Choose 5 interests',
        icon: 'users',
    },
    {
        id: 'organizer',
        title: 'Organizer',
        description:
            'Publish your first event',
        icon: 'megaphone',
    },
    {
        id: 'event-maker',
        title: 'Event Maker',
        description:
            'Publish 5 events',
        icon: 'party-popper',
    },
];