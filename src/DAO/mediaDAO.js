

const db = require('../handler/database');






/**
 * @param {Object} filters
 * @param {Object} options
 * @returns {Promise<Array>} 
 */
async function findMedias(filters = {}, options = {}) {
  let query = `    
        SELECT 
            m.*,
            COUNT(CASE WHEN v.reacao = true THEN 1 ELSE NULL END) AS votos_positivos,
            COUNT(CASE WHEN v.reacao = false THEN 1 ELSE NULL END) AS votos_negativos
            FROM medias AS m
            LEFT JOIN votos AS v ON m.id = v.media_id
        `;
  const params = [];
  const clauses = [];
  if (filters.titulo) {
    clauses.push(`titulo ILIKE $${params.length + 1}`);
    params.push(`%${filters.titulo}%`);
  }

  if (filters.genero) {

    clauses.push(`genero ? $${params.length + 1}`);
    params.push(filters.genero);
  }

  if (clauses.length > 0) {
    query += ' WHERE ' + clauses.join(' AND ');
  }
  query += ` GROUP BY m.id`;

  if (options.orderBy) {
    const allowedColumns = ['id', 'titulo', 'descricao', 'genero','votos_positivos', 'votos_negativos'];
    if (allowedColumns.includes(options.orderBy)) {
      const direction = options.orderDirection?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      query += ` ORDER BY ${options.orderBy} ${direction}`;
    }
  }

  try {
    const { rows } = await db.query(query, params);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar mídias:', error);
    throw error;
  }
}
/**
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function findById(id) {
  // A query é a mesma do findMedias, mas com um filtro WHERE id = $1
  const query = `
    SELECT
      m.*,
      COUNT(CASE WHEN v.reacao = true THEN 1 ELSE NULL END) AS votos_positivos,
      COUNT(CASE WHEN v.reacao = false THEN 1 ELSE NULL END) AS votos_negativos
    FROM medias AS m
    LEFT JOIN votos AS v ON m.id = v.media_id
    WHERE m.id = $1
    GROUP BY m.id;
  `;
  const params = [id];

  try {
    const { rows } = await db.query(query, params);
    // Retorna a primeira (e única) linha encontrada, ou null
    return rows[0] || null;
  } catch (error) {
    console.error(`Erro ao buscar mídia com ID ${id}:`, error);
    throw error;
  }
}
/**
 * @param {Object} mediaData
 * @param {string} mediaData.titulo
 * @param {string} mediaData.descricao
 * @param {string[]} mediaData.genero
 * @param {string} mediaData.imagem_url
 * @returns {Promise<Object>}
 */
async function createMedia(mediaData) {
  const { titulo, descricao, genero, imagem_url } = mediaData;
  const generoJSON = JSON.stringify(genero);

  const query = `
    INSERT INTO medias (titulo, descricao, genero, imagem_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const params = [titulo, descricao, generoJSON, imagem_url];

  try {
    const { rows } = await db.query(query, params);
    // O driver 'pg' já converte o JSON do banco para um objeto JavaScript
    return rows[0]; 
  } catch (error) {
    console.error('Erro ao criar mídia:', error);
    throw error;
  }
}
/**
 * @param {number} id
 * @param {Object} updateData
 * @param {string} [updateData.titulo]
 * @param {string} [updateData.descricao]
 * @param {string[]} [updateData.genero]
 * @param {string} [updateData.imagem_url]
 * @returns {Promise<Object|null>}
 */
async function updateMedia(id, updateData) {
  const updates = [];
  const params = [id];
  let paramIndex = 2;

  if (updateData.titulo) {
    updates.push(`titulo = $${paramIndex++}`);
    params.push(updateData.titulo);
  }
  if (updateData.descricao) {
    updates.push(`descricao = $${paramIndex++}`);
    params.push(updateData.descricao);
  }
  if (updateData.genero) {
    const generoJSON = JSON.stringify(updateData.genero);
    updates.push(`genero = $${paramIndex++}`);
    params.push(generoJSON);
  }
  if (updateData.imagem_url) {
    updates.push(`imagem_url = $${paramIndex++}`);
    params.push(updateData.imagem_url);
  }

  // Se não houver campos para atualizar, retorne null
  if (updates.length === 0) {
    return null;
  }

  const query = `
    UPDATE medias
    SET ${updates.join(', ')}
    WHERE id = $1
    RETURNING *;
  `;

  try {
    const { rows } = await db.query(query, params);
    return rows[0];
  } catch (error) {
    console.error(`Erro ao atualizar mídia com ID ${id}:`, error);
    throw error;
  }
}

module.exports = {
  findMedias,
  findById,
  createMedia,
  updateMedia,
};