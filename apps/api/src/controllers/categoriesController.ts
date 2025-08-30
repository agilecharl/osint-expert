import { Request, Response } from 'express';
import { fetchCategories } from '../services/categoriesServices';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const tools = await fetchCategories();
    res.json(tools);
  } catch (error) {
    console.error('Error in getExample:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
