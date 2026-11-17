import fs from 'node:fs/promises';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const file = process.argv[2];
if (!file) throw new Error('Debes indicar un archivo SQL.');

const sql = await fs.readFile(file, 'utf8');
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
});

try {
  await connection.query(sql);
  console.log(`SQL ejecutado correctamente: ${file}`);
} finally {
  await connection.end();
}
