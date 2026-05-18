import { Router } from 'express';
import {
  createLead, getLeads, getLead,
  updateLead, deleteLead, exportCSV
} from '../controllers/lead.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { createLead, getLeads, getLead, updateLead, deleteLead, exportCSV, getStats } from '../controllers/lead.controller';

const router = Router();
router.get('/stats', getStats);
router.use(protect);

router.get('/export', exportCSV);
router.get('/', getLeads);
router.post('/', createLead);
router.get('/:id', getLead);
router.put('/:id', updateLead);
router.delete('/:id', adminOnly, deleteLead);

export default router;
