import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export const getUsers = async (params: any) =>
  await api.get("/users", { params });
export const getUser = async (id: number) => await api.get(`/users/${id}`);
export const createUser = async (data: any) => await api.post("/users", data);
export const updateUser = async (id: number, data: any) =>
  await api.put(`/users/${id}`, data);
export const deleteUser = async (id: number) =>
  await api.delete(`/users/${id}`);

export default api;
