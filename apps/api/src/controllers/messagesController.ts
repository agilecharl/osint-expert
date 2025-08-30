import { Request, Response } from 'express';
import { fetchMessageCount } from '../services/messagesServices';

export const getMessageCount = async (req: Request, res: Response) => {
  try {
    const tools = await fetchMessageCount();
    res.json(tools);
  } catch (error) {
    console.error('Error in getExample:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
