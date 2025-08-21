import express from 'express';
import * as path from 'path';
import { Pool } from 'pg';

const app = express();
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Set your DB connection string in env
});

// Get all tools
app.get('/api/tools', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM osint.tools');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tools:', err);
    res.status(500).json({ error: 'Failed to fetch tools' });
  }
});

// Create a new tool
app.post('/api/tools', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO osint.tools (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating tool:', err);
    res.status(500).json({ error: 'Failed to create tool' });
  }
});

// Update a tool
app.put('/api/tools/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE osint.tools SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Tool not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error updating tool:', err);
    res.status(500).json({ error: 'Failed to update tool' });
  }
});

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
