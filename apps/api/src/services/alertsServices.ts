import { pgQuery } from '../helpers/db';

export const fetchAlertCount = async (): Promise<number> => {
  const result = await pgQuery('SELECT count(*) FROM alerts');
  return Number(result[0]?.count ?? 0);
};
