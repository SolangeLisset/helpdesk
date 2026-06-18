import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { attachmentsRouter } from './routes/attachments.js';
import { authRouter } from './routes/auth.js';
import { ticketsRouter } from './routes/tickets.js';
import { usersRouter } from './routes/users.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = (process.env.CLIENT_URL || 'http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origen no permitido por CORS'));
    }
  })
);
app.use(express.json());
app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'server/uploads'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'helpdesk-api' });
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api', attachmentsRouter);

app.use((err, _req, res, next) => {
  void next;
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, () => {
  console.log(`Helpdesk API running on http://127.0.0.1:${port}`);
});
