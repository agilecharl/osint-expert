import { pgQuery } from '../helpers/db';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category?: string;
}

export const fetchCategories = async (): Promise<Tool[]> => {
  const tools = await pgQuery('SELECT * FROM categories');
  return tools;
};
