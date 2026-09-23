import api from './api';

export const getBanks = async () => {
    const response = await api.get('/banks/getBanks');

    return response.data;
};

export const createBank = async (bank) => {
    const response = await api.post(
        '/banks/createBanks',
        bank
    );

    return response.data;
};

export const updateBank = async (id, bank) => {
    const response = await api.put(
        `/banks/updateBanks/${id}`,
        bank
    );

    return response.data;
};

export const deleteBank = async (id) => {
    const response = await api.delete(
        `/banks/deleteBanks/${id}`
    );

    return response.data;
};