// db.js

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'usuario',
  host: process.env.DB_HOST || 'locahost',
  database: process.env.DB_NAME || 'banco_de_dados',
  password: process.env.DB_PASSWORD || 'senha',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * @param {string} text
 * @param {Array} params
 * @returns {Promise<Object>}
 */
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executada:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Erro na query:', { text, error });
    throw error;
  }
}

module.exports = {
  query,
  pool,
};