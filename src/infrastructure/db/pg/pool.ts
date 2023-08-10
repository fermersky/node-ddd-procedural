import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'best_driver_db',
  user: 'postgres',
  password: '123',
});

console.log('connected to Postgres 🔥');

export default pool;
