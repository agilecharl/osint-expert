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

export const fetchTargetCount = async (): Promise<number> => {
  const result = await pgQuery('SELECT count(*) FROM targets');
  return Number(result[0]?.count ?? 0);
};
