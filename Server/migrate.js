import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, 'migrations');

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

async function getAppliedMigrations(client) {
  const result = await client.query('SELECT filename FROM schema_migrations');
  return new Set(result.rows.map(r => r.filename));
}

async function applyMigration(client, filePath, filename) {
  const sql = fs.readFileSync(filePath, 'utf8');
  console.log(`\nApplying migration: ${filename}`);
  await client.query('BEGIN');
  try {
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [filename]);
    await client.query('COMMIT');
    console.log(`✅ Applied ${filename}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`❌ Failed ${filename}:`, err.message);
    throw err;
  }
}

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL not set. Aborting.');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  await client.connect();
  try {
    await ensureMigrationsTable(client);

    const applied = await getAppliedMigrations(client);
    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const filename of files) {
      if (applied.has(filename)) {
        console.log(`Skipping already applied: ${filename}`);
        continue;
      }
      const filePath = path.join(migrationsDir, filename);
      await applyMigration(client, filePath, filename);
    }

    console.log('\nAll migrations are up to date.');
  } finally {
    await client.end();
  }
}

run().catch(err => {
  console.error('Migration run failed:', err);
  process.exit(1);
});


