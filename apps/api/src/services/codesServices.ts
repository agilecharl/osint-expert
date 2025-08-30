import { pgQuery } from '../helpers/db';

export interface Code {
  id: string;
  code: string;
  description: string;
  category?: string;
}

export const fetchCodes = async (): Promise<Code[]> => {
  const codes = await pgQuery('SELECT * FROM codes');
  return codes;
};
