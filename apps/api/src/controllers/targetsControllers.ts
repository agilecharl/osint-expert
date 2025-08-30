import { Request, Response } from 'express';
import { fetchTargetCount, fetchTargets } from '../services/targetsServices';

export const getTargets = async (req: Request, res: Response) => {
  try {
    const tools = await fetchTargets();
    res.json(tools);
  } catch (error) {
    console.error('Error in getExample:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTargetCount = async (req: Request, res: Response) => {
  try {
    const count = await fetchTargetCount();
    res.json({ count });
  } catch (error) {
    console.error('Error in getTargetCount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
