import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
  createBugController,
  deleteBugController,
  getBugByIdController,
  getBugsController,
  updateBugController,
} from '../controllers/bug.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getBugsController);
router.get('/:id', getBugByIdController);
router.post('/', createBugController);
router.put('/:id', updateBugController);
router.delete('/:id', deleteBugController);

export default router;
