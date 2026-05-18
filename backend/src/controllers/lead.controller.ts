import { Response } from 'express';
import Lead from '../models/Lead.model';
import { AuthRequest, LeadStatus, LeadSource } from '../types';

const VALID_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const VALID_SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    if (!name || !email || !source) {
      res.status(400).json({ success: false, message: 'Name, email and source are required' });
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ success: false, message: 'Invalid email format' });
      return;
    }
    if (!VALID_SOURCES.includes(source)) {
      res.status(400).json({ success: false, message: `Source must be one of: ${VALID_SOURCES.join(', ')}` });
      return;
    }
    if (status && !VALID_STATUSES.includes(status)) {
      res.status(400).json({ success: false, message: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
      return;
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      status: status || 'New',
      source,
      createdBy: req.user?.id,
    });
    res.status(201).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: String(error) });
  }
};

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, source, search, sort, page = '1', limit = '10' } = req.query;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: String(error) });
  }
};

export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }
    res.status(200).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: String(error) });
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    if (email && !EMAIL_REGEX.test(email)) {
      res.status(400).json({ success: false, message: 'Invalid email format' });
      return;
    }
    if (status && !VALID_STATUSES.includes(status)) {
      res.status(400).json({ success: false, message: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
      return;
    }
    if (source && !VALID_SOURCES.includes(source)) {
      res.status(400).json({ success: false, message: `Source must be one of: ${VALID_SOURCES.join(', ')}` });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    if (status) updateData.status = status;
    if (source) updateData.source = source;

    const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, {
      new: true, runValidators: true,
    });
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }
    res.status(200).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: String(error) });
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: String(error) });
  }
};

export const exportCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, source, search } = req.query;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    const csv = [
      'Name,Email,Status,Source,Created At',
      ...leads.map(l => `${l.name},${l.email},${l.status},${l.source},${l.createdAt}`)
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: String(error) });
  }
};

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [total, newCount, qualifiedCount, lostCount] = await Promise.all([
      Lead.countDocuments({}),
      Lead.countDocuments({ status: 'New' }),
      Lead.countDocuments({ status: 'Qualified' }),
      Lead.countDocuments({ status: 'Lost' }),
    ]);
    res.status(200).json({
      success: true,
      stats: { total, new: newCount, qualified: qualifiedCount, lost: lostCount },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: String(error) });
  }
};