import { Request, Response } from 'express';
import { fetchMessageCount } from '../services/generalServices';

export const getMessageCount = async (req: Request, res: Response) => {
  try {
    const codes = await fetchMessageCount();
    res.json(codes);
  } catch (error) {
    console.error('Error in getExample:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
