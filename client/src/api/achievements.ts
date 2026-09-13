import { api } from './api';

export type UserAchievement = {
    id: string;
    title: string;
    description: string;
    earned: boolean;
};

type AchievementsResponse = {
    earned: UserAchievement[];
    all: UserAchievement[];
};

export const getMyAchievements =
    async () => {
        const response =
            await api.get<AchievementsResponse>(
                '/achievements/me',
            );

        return response.data;
    };