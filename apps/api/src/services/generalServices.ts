import { pgQuery } from '../helpers/db';

export const fetchMessageCount = async (): Promise<number> => {
  const result = await pgQuery('SELECT count(*) FROM messages');
  return Number(result[0]?.count ?? 0);
};
