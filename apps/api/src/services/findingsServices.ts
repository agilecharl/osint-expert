import { pgQuery } from '../helpers/db';

export const fetchFindingCount = async (): Promise<number> => {
  const result = await pgQuery('SELECT count(*) FROM findings');
  return Number(result[0]?.count ?? 0);
};
