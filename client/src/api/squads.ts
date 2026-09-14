import { api } from './api';

export type SquadMember = {
    id: number;
    user: {
        id: number;
        name: string;
    };
};

export type Squad = {
    id: number;
    cityId: number;
    categoryId: number;
    groupSizeMin: number;
    groupSizeMax: number;
    interests: string[];
    status: 'open' | 'formed';
    members: SquadMember[];
    createdAt: string;
};

export type CreateSquadData = {
    cityId: number;
    categoryId: number;
    groupSizeMin: number;
    groupSizeMax: number;
    interests: string[];
};

export const createOrJoinSquad = async (
    data: CreateSquadData,
) => {
    const response = await api.post<Squad>(
        '/squads',
        data,
    );

    return response.data;
};

export const getMySquads = async () => {
    const response = await api.get<Squad[]>(
        '/squads/my',
    );

    return response.data;
};