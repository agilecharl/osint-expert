import cors from 'cors';
import express from 'express';
import * as path from 'path';
import { Pool } from 'pg';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
  })
);

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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

// Get counters
app.get('/api/counters', async (req, res) => {
  try {
    const alertsResult = await pool.query('SELECT COUNT(*) FROM osint.alerts');
    const targetsResult = await pool.query(
      'SELECT COUNT(*) FROM osint.targets'
    );
    const findingsResult = await pool.query(
      'SELECT COUNT(*) FROM osint.findings'
    );
    const messagesResult = await pool.query(
      'SELECT COUNT(*) FROM osint.messages'
    );

    res.json({
      alerts: parseInt(alertsResult.rows[0].count, 10),
      targets: parseInt(targetsResult.rows[0].count, 10),
      findings: parseInt(findingsResult.rows[0].count, 10),
      messages: parseInt(messagesResult.rows[0].count, 10),
    });
  } catch (err) {
    console.error('Error fetching tool counters:', err);
    res.status(500).json({ error: 'Failed to fetch tool counters' });
  }
});

// Get all targets
app.get('/api/targets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM osint.targets');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching targets:', err);
    res.status(500).json({ error: 'Failed to fetch targets' });
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
