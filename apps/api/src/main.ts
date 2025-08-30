import cors from 'cors';
import express from 'express';
import * as path from 'path';
import alertsRoutes from './routes/alertsRoutes';
import categoriesRoutes from './routes/categoriesRoutes';
import codesRoutes from './routes/codesRoutes';
import findingsRoutes from './routes/findingsRoutes';
import generalRoutes from './routes/generalRoutes';
import messagesRoutes from './routes/messagesRoutes';
import targetsRoutes from './routes/targetsRoutes';
import toolsRoutes from './routes/toolsRoutes';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
  })
);

app.use('/api', alertsRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', codesRoutes);
app.use('/api', findingsRoutes);
app.use('/api', messagesRoutes);
app.use('/api', generalRoutes);
app.use('/api', targetsRoutes);
app.use('/api', toolsRoutes);

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

/*
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
*/

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
