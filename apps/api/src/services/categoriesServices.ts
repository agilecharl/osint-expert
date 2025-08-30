import { pgQuery } from '../helpers/db';

export interface Category {
  id: string;
  category: string;
  description: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  const categories = await pgQuery('SELECT * FROM categories');
  return categories;
};
