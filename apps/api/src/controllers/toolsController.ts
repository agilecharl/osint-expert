import { Request, Response } from 'express';
import { createTool, fetchTools, updateTool } from '../services/toolsServices';

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
  try {
    const tool = await fetchTools(req.params.id);
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

export const newTool = async (req: Request, res: Response) => {
  try {
    await createTool(req.body);
    res.status(201).json({ message: 'Tool created successfully' });
  } catch (error) {
    console.error('Error in createTool:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const setTool = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await updateTool(id, req.body);
    res.json({ message: `Tool with id ${id} updated successfully` });
  } catch (error) {
    console.error('Error in updateTool:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
