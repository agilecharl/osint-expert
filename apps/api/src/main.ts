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
  const { tool, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO osint.tools (tool, description) VALUES ($1, $2) RETURNING *',
      [tool, description]
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
  const { tool, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE osint.tools SET tool = $1, description = $2 WHERE id = $3 RETURNING *',
      [tool, description, id]
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

// Create a new target
app.post('/api/targets', async (req, res) => {
  const { target, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO osint.targets (target, description) VALUES ($1, $2) RETURNING *',
      [target, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating target:', err);
    res.status(500).json({ error: 'Failed to create target' });
  }
});

// Get all weblinks
app.get('/api/weblinks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM osint.weblinks');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching weblinks:', err);
    res.status(500).json({ error: 'Failed to fetch weblinks' });
  }
});

app.get('/api/stage-weblinks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM osint.stage_weblinks WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Stage weblink not found' });
    } else {
      res.json(result.rows);
    }
  } catch (err) {
    console.error('Error fetching stage weblink:', err);
    res.status(500).json({ error: 'Failed to fetch stage weblink' });
  }
});

app.put('/api/stage-weblinks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, url, weblink_type } = req.body;
  try {
    const result = await pool.query(
      'UPDATE osint.stage_weblinks SET title = $1, description = $2, url = $3, weblink_type = $4 WHERE id = $5 RETURNING *',
      [title, description, url, weblink_type, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Stage weblink not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error updating stage weblink:', err);
    res.status(500).json({ error: 'Failed to update stage weblink' });
  }
});

// Get all stage-weblinks
app.get('/api/stage-weblinks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM osint.stage_weblinks');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching stage-weblinks:', err);
    res.status(500).json({ error: 'Failed to fetch stage-weblinks' });
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
