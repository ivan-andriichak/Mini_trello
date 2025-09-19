import axios from 'axios';
import {AuthResponse, Board, Card, Column} from '../types';


const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config.sent) {
      error.config.sent = true;
      await refresh();
      return api(error.config);
    }
    return Promise.reject(error);
  }
);

export const register = async (data: { email: string; password: string; name: string}) => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const login = async (data: { email: string; password: string }) => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const refresh = async () => {
  const response = await api.post<{ accessToken: string }>('/auth/refresh');
  return response.data;
};

export const logout = async () => {
  await api.get('/auth/logout');
};

export const createBoard = async (data: { title: string }) => {
  const response = await api.post<Board>('/boards', data);
  return response.data;
};

export const getBoards = async () => {
  const response = await api.get<Board[]>('/boards');
  return response.data;
};

export const getBoard = async (id: number) => {
  const response = await api.get<Board>(`/boards/${id}`);
  return response.data;
};

export const updateBoard = async (id: number, data: { title?: string }) => {
  const response = await api.patch<Board>(`/boards/${id}`, data);
  return response.data;
};

export const deleteBoard = async (id: number) => {
  await api.delete(`/boards/${id}`);
};

export const createColumn = async (boardId: number, data: { title: string; order: number }) => {
  const response = await api.post<Column>(`/boards/${boardId}/columns`, data);
  return response.data;
};

export const getColumns = async (boardId: number) => {
  const response = await api.get<Column[]>(`/boards/${boardId}/columns`);
  return response.data;
};

export const updateColumn = async (boardId: number, id: number, data: { title?: string; order?: number }) => {
  const response = await api.patch<Column>(`/boards/${boardId}/columns/${id}`, data);
  return response.data;
};

export const deleteColumn = async (boardId: number, id: number) => {
  await api.delete(`/boards/${boardId}/columns/${id}`);
};

export const createCard = async (boardId: number, columnId: number, data: { title: string; description?: string; order: number }) => {
  const response = await api.post<Card>(`/boards/${boardId}/columns/${columnId}/cards`, data);
  return response.data;
};

export const getCards = async (boardId: number, columnId: number) => {
  const response = await api.get<Card[]>(`/boards/${boardId}/columns/${columnId}/cards`);
  return response.data;
};

export const updateCard = async (
  boardId: number,
  columnId: number,
  id: number,
  data: { title?: string; description?: string; order?: number; columnId?: number }
) => {
  const response = await api.patch<Card>(`/boards/${boardId}/columns/${columnId}/cards/${id}`, data);
  return response.data;
};

export const deleteCard = async (boardId: number, columnId: number, id: number) => {
  await api.delete(`/boards/${boardId}/columns/${columnId}/cards/${id}`);
};