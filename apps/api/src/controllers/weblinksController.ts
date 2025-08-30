import { Request, Response } from 'express';
import { fetchWeblinks } from '../services/weblinksServices';

export const getWeblinks = async (req: Request, res: Response) => {
  try {
    const weblinks = await fetchWeblinks();
    res.json(weblinks);
  } catch (error) {
    console.error('Error in getExample:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
