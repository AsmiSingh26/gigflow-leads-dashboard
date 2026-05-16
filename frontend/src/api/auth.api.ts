import api from './axios';
import type { AuthResponse } from '../types';

export const registerApi = async (data: {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'sales';
}): Promise<AuthResponse> => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const loginApi = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await api.post('/auth/login', data);
  return res.data;
};