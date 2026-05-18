import api from './axios';
import type { LeadsResponse, Lead } from '../types';

export const getLeadsApi = async (params: {
  page?: number;
  limit?: number;
  status?: string;
  source?: string;
  search?: string;
  sort?: string;
}): Promise<LeadsResponse> => {
  const res = await api.get('/leads', { params });
  return res.data;
};

export const createLeadApi = async (data: {
  name: string;
  email: string;
  status: string;
  source: string;
}): Promise<{ success: boolean; lead: Lead }> => {
  const res = await api.post('/leads', data);
  return res.data;
};

export const updateLeadApi = async (
  id: string,
  data: {
    name?: string;
    email?: string;
    status?: string;
    source?: string;
  }
): Promise<{ success: boolean; lead: Lead }> => {
  const res = await api.put(`/leads/${id}`, data);
  return res.data;
};

export const deleteLeadApi = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete(`/leads/${id}`);
  return res.data;
};

export const exportCSVApi = async (params?: {
  status?: string;
  source?: string;
  search?: string;
}): Promise<void> => {
  const res = await api.get('/leads/export', { params, responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'leads.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export interface LeadStats {
  total: number;
  new: number;
  qualified: number;
  lost: number;
}

export const getStatsApi = async (): Promise<LeadStats> => {
  const res = await api.get('/leads/stats');
  return res.data.stats;
};
