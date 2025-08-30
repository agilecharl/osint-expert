import { Request, Response } from 'express';
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '../services/categoriesServices';
import { fetchCodes } from '../services/codesServices';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const tools = await fetchCategories();
    res.json(tools);
  } catch (error) {
    console.error('Error in getExample:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategoryCodes = async (req: Request, res: Response) => {
  try {
    const codes = await fetchCodes();
    res.json(codes);
  } catch (error) {
    console.error('Error in getCodes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const newCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.body;
    if (!category) {
      res.status(400).json({ error: 'Category is required' });
      return;
    }
    const newCat = await createCategory(category);
    res.status(201).json(newCat);
    return;
  } catch (error) {
    console.error('Error in newCategory:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};

export const updateExistingCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { category, description } = req.body;
    if (!category || !description) {
      res.status(400).json({ error: 'Category and description are required' });
      return;
    }
    const updatedCat = await updateCategory(id, category, description);
    if (!updatedCat) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(updatedCat);
    return;
  } catch (error) {
    console.error('Error in updateExistingCategory:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};

export const removeCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await deleteCategory(id);
    if (!success) {
      res
        .status(404)
        .json({ error: 'Category not found or could not be deleted' });
      return;
    }
    res.json({ message: 'Category deleted successfully' });
    return;
  } catch (error) {
    console.error('Error in removeCategory:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
