import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'DiveApp',
  password: '12nadav!0',
  port: 5432,
});

// Test the connectivity of the DB
pool.query('SELECT NOW()')
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch(err => console.error('❌ PostgreSQL connection error', err)
);

export default pool;