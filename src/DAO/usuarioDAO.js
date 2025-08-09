const db = require('../handler/database');  

/**
 * @param {string} login
 * @returns {Promise<Object|null>} 
 */
async function findByLogin(login) {
  const query = 'SELECT * FROM usuarios WHERE login = $1';
  const params = [login];

  try {
    const { rows } = await db.query(query, params);
    return rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar usuário por login:', error);
    throw error;
  }
}

/**
 * @param {string} login
 * @param {string} senha
 * @returns {Promise<Object>}
 */
async function createUser(login, senha) {
  const query = `
    INSERT INTO usuarios (login, senha)
    VALUES ($1, $2)
    RETURNING id, login;
  `;
  const params = [login, senha];

  try {
    const { rows } = await db.query(query, params);
    return rows[0];
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

module.exports = {
  findByLogin,
  createUser,
};