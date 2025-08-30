import { pgQuery } from '../helpers/db';

export interface Code {
  id: string;
  code: string;
  description: string;
  category?: string;
}

export const fetchCodes = async (
  id?: string,
  code?: string
): Promise<Code[]> => {
  let query = 'SELECT * FROM codes';
  const params: any[] = [];
  const conditions: string[] = [];

  if (id) {
    conditions.push('id = $' + (params.length + 1));
    params.push(id);
  }
  if (code) {
    conditions.push('code = $' + (params.length + 1));
    params.push(code);
  }
  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  const codes = await pgQuery(query, params);
  return codes;
};
