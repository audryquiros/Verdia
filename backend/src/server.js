import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { testDatabaseConnection } from './config/database.js';
import routes from './routes/index.js';

const app = express();
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use('/api', routes);
app.use((_req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

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
