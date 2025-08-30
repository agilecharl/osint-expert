import { Router } from 'express';
import {
  getCategories,
  getCategoryCodes,
} from '../controllers/categoriesController';

const router = Router();

router.get('/categories', getCategories);
router.get('/categories/:1/codes', getCategoryCodes);

export default router;
