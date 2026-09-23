import api from './api';

export const getSettings = async () => {
    const response = await api.get(
        '/settings/getSettings'
    );

    return response.data;
};

export const updateSettings = async (id, settings) => {
    const response = await api.put(
        `/settings/updateSettings/${id}`,
        settings
    );

    return response.data;
};