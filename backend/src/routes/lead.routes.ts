import { Router } from 'express';
import { createLead, getLeads, getLead, updateLead, deleteLead, exportCSV, getStats } from '../controllers/lead.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/stats', getStats);
router.get('/export', exportCSV);
router.get('/', getLeads);
router.post('/', createLead);
router.get('/:id', getLead);
router.put('/:id', updateLead);
router.delete('/:id', adminOnly, deleteLead);

export default router;
