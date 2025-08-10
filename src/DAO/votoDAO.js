// votoDAO.js

const db = require('../handler/database');  

/**
 * Contabiliza o total de votos positivos, negativos e o total geral de todas as mídias.
 * @returns {Promise<Object>} Um objeto com os totais de votos.
 */
async function getVotosTotais() {
  const query = `
    SELECT 
      SUM(CASE WHEN reacao = true THEN 1 ELSE 0 END) AS votos_positivos,
      SUM(CASE WHEN reacao = false THEN 1 ELSE 0 END) AS votos_negativos,
      COUNT(*) AS total_votos
    FROM votos;
  `;

  try {
    const { rows } = await db.query(query);
    const result = rows[0];

    // O retorno será um objeto com as contagens
    return {
      votos_positivos: parseInt(result.votos_positivos) || 0,
      votos_negativos: parseInt(result.votos_negativos) || 0,
      total_votos: parseInt(result.total_votos) || 0,
    };
  } catch (error) {
    console.error('Erro ao buscar totais de votos:', error);
    throw error;
  }
}
/**
 * Busca a reação de um usuário para um filme ou série específico.
 * @param {number} usuarioId - O ID do usuário.
 * @param {number} mediaId - O ID da mídia.
 * @returns {Promise<boolean|null>} A reação (true para positivo, false para negativo) ou null se não houver voto.
 */
async function getReacaoDoUsuario(usuarioId, mediaId) {
  const query = `
    SELECT reacao FROM votos
    WHERE usuario_id = $1 AND media_id = $2;
  `;
  const params = [usuarioId, mediaId];

  try {
    const { rows } = await db.query(query, params);
    if (rows.length > 0) {
      return rows[0].reacao;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar reação do usuário:', error);
    throw error;
  }
}
/**
 * Realiza o voto do usuário em filme ou série especifico.
 * @param {number} usuarioId 
 * @param {number} mediaId
 * @param {boolean} reacao
 * @returns {Promise<Object>}
 */
async function votar(usuarioId, mediaId, reacao) {
  const checkQuery = `
    SELECT *
    FROM votos
    WHERE usuario_id = $1 AND media_id = $2;
  `;
  const checkParams = [usuarioId, mediaId];

  try {
    const { rows } = await db.query(checkQuery, checkParams); //verifica se o usuário já votou no filme ou série selecionado

    if (rows.length > 0) {
      const updateQuery = `
        UPDATE votos
        SET reacao = $1
        WHERE usuario_id = $2 AND media_id = $3
        RETURNING *;
      `;
      const updateParams = [reacao, usuarioId, mediaId];
      const result = await db.query(updateQuery, updateParams); //Se o usuário já votou, atualiza o voto dele
      console.log(`Voto atualizado: usuário ${usuarioId} na mídia ${mediaId}.`);
      return result.rows[0];
    } else {
      const insertQuery = `
        INSERT INTO votos (usuario_id, media_id, reacao)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const insertParams = [usuarioId, mediaId, reacao];
      const result = await db.query(insertQuery, insertParams); //Se o usuário não tiver votado, realiza novo voto
      console.log(`Novo voto registrado: usuário ${usuarioId} na mídia ${mediaId}.`);
      return result.rows[0];
    }
  } catch (error) {
    console.error('Erro ao registrar voto:', error);
    throw error;
  }
}

/**
 * Remove o voto do usuário em filme ou série especifico.
 * @param {number} usuarioId
 * @param {number} mediaId
 * @returns {Promise<boolean>}
 */
async function removerVoto(usuarioId, mediaId) {
  const query = `
    DELETE FROM votos
    WHERE usuario_id = $1 AND media_id = $2;
  `;
  const params = [usuarioId, mediaId];

  try {
    const result = await db.query(query, params);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Erro ao remover voto:', error);
    throw error;
  }
}

module.exports = {
  getVotosTotais,
  getReacaoDoUsuario,
  votar,
  removerVoto,
};