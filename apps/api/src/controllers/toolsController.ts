import { Request, Response } from 'express';
import { fetchTools } from '../services/toolsServices';

export const getTools = async (req: Request, res: Response) => {
  try {
    const tools = await fetchTools();
    res.json(tools);
  } catch (error) {
    console.error('Error in getExample:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getToolById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const tools = await fetchTools();
    const tool = tools.find((t) => t.id === id);
    if (tool) {
      res.json(tool);
    } else {
      res.status(404).json({ error: 'Tool not found' });
    }
  } catch (error) {
    console.error('Error in getToolById:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTool = async (req: Request, res: Response) => {
  try {
    // Logic to create a new tool
    res.status(201).json({ message: 'Tool created successfully' });
  } catch (error) {
    console.error('Error in createTool:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTool = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Logic to update the tool with the given id
    res.json({ message: `Tool with id ${id} updated successfully` });
  } catch (error) {
    console.error('Error in updateTool:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
