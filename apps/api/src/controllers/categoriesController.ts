import { Request, Response } from 'express';
import { fetchCategories } from '../services/categoriesServices';
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
