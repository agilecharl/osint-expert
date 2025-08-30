import { Request, Response } from 'express';
import { fetchCodes } from '../services/codesServices';

export const getCodes = async (req: Request, res: Response) => {
  try {
    const codes = await fetchCodes();
    res.json(codes);
  } catch (error) {
    console.error('Error in getExample:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
