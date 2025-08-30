import express, { Router } from 'express';
import {
  getCategories,
  getCategoryCodes,
  newCategory,
  removeCategory,
  updateExistingCategory,
} from '../controllers/categoriesController';

const router = Router();
router.use(express.json());

router.get('/categories/:category/codes', getCategoryCodes);
router.get('/categories', getCategories);
router.post('/categories', newCategory);
router.put('/categories/:id', updateExistingCategory);
router.delete('/categories/:id', removeCategory);

export default router;
