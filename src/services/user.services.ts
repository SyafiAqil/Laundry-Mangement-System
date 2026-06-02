import { api } from "./api";

export interface CreateUserDto {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const createUser = async (
  data: CreateUserDto
) => {
  const response = await api.post(
    "/users",
    data
  );

  return response.data;
};

export const deleteUser = async (
  id: number
) => {
  const response = await api.delete(
    `/users/${id}`
  );

  return response.data;
};

export const getUserById = async (
  id: number
) => {
  const response = await api.get(
    `/users/${id}`
  );

  return response.data;
};

export const updateUser = async (
  id: number,
  data: {
    name: string;
    email: string;
    phone: string;
  }
) => {
  const response = await api.patch(
    `/users/${id}`,
    data
  );

  return response.data;
};