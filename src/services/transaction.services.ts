import { api } from "@/services/api";

export const getTransactions =
  async () => {
    const response =
      await api.get(
        "/transactions"
      );

    return response.data;
  };

export const getTransactionById =
  async (id: number) => {
    const response =
      await api.get(
        `/transactions/${id}`
      );

    return response.data;
  };

export const approveTransaction =
  async (id: number) => {
    const response =
      await api.patch(
        `/transactions/${id}/approve`
      );

    return response.data;
  };

export const rejectTransaction =
  async (id: number) => {
    const response =
      await api.patch(
        `/transactions/${id}/reject`
      );

    return response.data;
  };

export const deleteTransaction =
  async (id: number) => {
    const response =
      await api.delete(
        `/transactions/${id}`
      );

    return response.data;
  };

  export const getMyTransactions =
  async () => {
    const response =
      await api.get(
        "/transactions/me"
      );

    return response.data;
  };

  export const uploadPaymentProof =
  async (
    id: number,
    formData: FormData
  ) => {
    const response =
      await api.post(
        `/transactions/${id}/upload-proof`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };