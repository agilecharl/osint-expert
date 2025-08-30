import { pgQuery } from '../helpers/db';

export interface Weblink {
  id: string;
  url: string;
  description: string;
  title: string;
  weblink_type?: string;
}

export const fetchWeblinks = async (): Promise<Weblink[]> => {
  const tools = await pgQuery('SELECT * FROM weblinks');
  return tools;
};
