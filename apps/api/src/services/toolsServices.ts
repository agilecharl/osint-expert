import { pgQuery } from '../helpers/db';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category?: string;
}

export const fetchTools = async (id?: string): Promise<Tool[]> => {
  const query = id
    ? 'SELECT * FROM tools WHERE id = $1'
    : 'SELECT * FROM tools';
  const params = id ? [id] : [];
  const tools = await pgQuery(query, params);

  return tools;
};

export const createTool = async (tool: Omit<Tool, 'id'>): Promise<Tool> => {
  const { name, description, category } = tool;
  const result = await pgQuery(
    'INSERT INTO tools (name, description, category) VALUES ($1, $2, $3) RETURNING *',
    [name, description, category]
  );
  return result[0];
};

export const updateTool = async (
  id: string,
  tool: Partial<Omit<Tool, 'id'>>
): Promise<Tool | null> => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(tool)) {
    fields.push(`${key} = $${index}`);
    values.push(value);
    index++;
  }

  if (fields.length === 0) return null;

  values.push(id);
  const result = await pgQuery(
    `UPDATE tools SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
    values
  );
  return result[0] || null;
};

export const deleteTool = async (id: string): Promise<boolean> => {
  const result = await pgQuery('DELETE FROM tools WHERE id = $1 RETURNING id', [
    id,
  ]);
  return result.length > 0;
};
