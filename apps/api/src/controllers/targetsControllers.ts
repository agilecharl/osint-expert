import { Request, Response } from 'express';
import { fetchTargets } from '../services/targetsService';

export const getTargets = async (req: Request, res: Response) => {
  try {
    const tools = await fetchTargets();
    res.json(tools);
  } catch (error) {
    console.error('Error in getExample:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
