import api from "./api";

export const getTransfers = async (params = {}) => {
  const response = await api.get("/transfers/getTransfers", {
    params,
  });

  return response.data;
};

export const getOneTransfer = async (id) => {
  const response = await api.get(`/transfers/getOneTransfer/${id}`);

  return response.data;
};

export const createTransfer = async (transfer) => {
  const response = await api.post("/transfers/createTransfers", transfer);

  return response.data;
};

export const deleteTransfer = async (id) => {
  const response = await api.delete(`/transfers/deleteTransfers/${id}`);

  return response.data;
};
