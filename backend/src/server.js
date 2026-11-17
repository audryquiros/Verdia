import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { testDatabaseConnection } from './config/database.js';
import routes from './routes/index.js';
import db from './models/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.locals.db = db;
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use('/api', routes);
app.use((_req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));
app.use(errorHandler);

async function startServer() {
  try {
    await testDatabaseConnection();
    app.listen(env.PORT, () => {
      console.log(`Verdia API running on http://localhost:${env.PORT}`);
      console.log(`MySQL conectado a ${env.DB_NAME}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a MySQL:', error.message);
    process.exit(1);
  }
}

startServer();
