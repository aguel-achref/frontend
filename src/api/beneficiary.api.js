import api from './api';

export const getBeneficiaries = async () => {
    const response = await api.get(
        '/beneficiaries/getBeneficiaries'
    );

    return response.data;
};

export const getOneBeneficiary = async (id) => {
    const response = await api.get(
        `/beneficiaries/getOneBeneficiary/${id}`
    );

    return response.data;
};

export const createBeneficiary = async (beneficiary) => {
    const response = await api.post(
        '/beneficiaries/createBeneficiaries',
        beneficiary
    );

    return response.data;
};

export const updateBeneficiary = async (id, beneficiary) => {
    const response = await api.put(
        `/beneficiaries/updateBeneficiaries/${id}`,
        beneficiary
    );

    return response.data;
};

export const deleteBeneficiary = async (id) => {
    const response = await api.delete(
        `/beneficiaries/deleteBeneficiaries/${id}`
    );

    return response.data;
};