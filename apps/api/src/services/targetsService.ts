import { pgQuery } from '../helpers/db';

export interface Tool {
  id: string;
  name: string;
  description: string;
  targets?: string;
}

export const fetchTargets = async (): Promise<Tool[]> => {
  const tools = await pgQuery('SELECT * FROM targets');
  return tools;
};
