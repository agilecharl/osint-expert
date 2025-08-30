import { Request, Response } from 'express';
import { fetchFindingCount } from '../services/findingsServices';

export const getFindingCount = async (req: Request, res: Response) => {
  try {
    const alerts = await fetchFindingCount();
    res.json(alerts);
  } catch (error) {
    console.error('Error in getExample:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
