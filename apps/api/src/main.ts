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

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
