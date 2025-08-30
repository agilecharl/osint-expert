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

export const createCategory = async (category: string): Promise<Category> => {
  const result = await pgQuery(
    'INSERT INTO categories (category) VALUES ($1) RETURNING *',
    [category]
  );
  return result[0];
};

export const updateCategory = async (
  id: string,
  category: string,
  description: string
): Promise<Category | null> => {
  const result = await pgQuery(
    'UPDATE categories SET category = $1, description = $2 WHERE id = $3 RETURNING *',
    [category, description, id]
  );
  return result[0] || null;
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  const result = await pgQuery('DELETE FROM categories WHERE id = $1', [id]);
  return (
    Array.isArray(result) && result.includes('Category deleted successfully')
  );
};
