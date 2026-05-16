import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'sales';
  };
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type UserRole = 'admin' | 'sales';