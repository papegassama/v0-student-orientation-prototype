import { neon } from '@neondatabase/serverless';

let sql: any = null;

function getSql() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please add it to your environment variables.');
    }
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}

export { getSql as sql };
