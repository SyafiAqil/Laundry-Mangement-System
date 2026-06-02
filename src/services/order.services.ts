import { api } from "./api";

export interface CreateOrderDto {
  userId: number;
  weight: number;
  totalPrice: number;
  paymentMethod: string;
}

export const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const createOrder = async (
  data: CreateOrderDto
) => {
  const response = await api.post(
    "/orders",
    data
  );

  return response.data;
};

export const deleteOrder = async (
  id: number
) => {
  const response = await api.delete(
    `/orders/${id}`
  );

  return response.data;
};

export const updateOrderStatus = async (
  id: number,
  status: string
) => {
  const response = await api.patch(
    `/orders/${id}/status`,
    {
      status,
    }
  );

  return response.data;
};

export const getMyOrders =
  async () => {
    const response =
      await api.get(
        "/orders/me"
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