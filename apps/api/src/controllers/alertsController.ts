import { Request, Response } from 'express';
import { fetchAlertCount } from '../services/alertsServices';

export const getAlertCount = async (req: Request, res: Response) => {
  try {
    const alerts = await fetchAlertCount();
    res.json(alerts);
  } catch (error) {
    console.error('Error in getExample:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
