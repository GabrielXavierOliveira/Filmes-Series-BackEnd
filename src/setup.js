const db = require('./handler/database');

const createTablesQueries = `
  CREATE TABLE IF NOT EXISTS medias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR NOT NULL,
    descricao VARCHAR,
    genero JSON NOT NULL,
    imagem_url VARCHAR NOT NULL
  );

  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    login VARCHAR NOT NULL UNIQUE,
    senha VARCHAR NOT NULL
  );

  CREATE TABLE IF NOT EXISTS votos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL ,
    media_id INTEGER NOT NULL,
    reacao BOOLEAN DEFAULT TRUE NOT NULL
  );
`;

async function setupDatabase() {
  try {
    console.log('Verificando e criando as estruturas do banco de dados...');
    await db.query(createTablesQueries);
    console.log('Estruturas criadas com sucesso!');

    const adminUser = await db.query('SELECT id FROM usuarios WHERE login = $1', ['admin']);
    if (adminUser.rows.length === 0) {
      await db.query('INSERT INTO usuarios (login, senha) VALUES ($1, $2)', ['admin', 'admin']);
      console.log('Usuário "admin" criado com a senha "admin".');
    } else {
      console.log('Usuário "admin" já existe.');
    }
  } catch (error) {
    console.error('Erro na inicialização do banco de dados:', error);
    process.exit(1);
  }
}

module.exports = setupDatabase;