const db = require('./handler/database');

const createMediasTableQuery = `
  CREATE TABLE IF NOT EXISTS medias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR NOT NULL,
    descricao VARCHAR,
    genero JSON NOT NULL,
    imagem_url VARCHAR NOT NULL
  );
`;

const createUsuariosTableQuery = `
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    login VARCHAR NOT NULL UNIQUE,
    senha VARCHAR NOT NULL
  );
`;

const createVotosTableQuery = `
  CREATE TABLE IF NOT EXISTS votos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    media_id INTEGER NOT NULL REFERENCES medias(id),
    reacao BOOLEAN DEFAULT TRUE NOT NULL
  );
`;

const exemploMedias = [
  {
    titulo: 'Interestelar',
    descricao: 'Exploradores espaciais viajam através de um buraco de minhoca.',
    genero: ['Ficção Científica', 'Drama'],
    imagem_url: 'https://ingresso-a.akamaihd.net/img/cinema/cartaz/4238-cartaz.jpg'
  },
  {
    titulo: 'Matrix',
    descricao: 'Um hacker aprende com os misteriosos rebeldes sobre a verdadeira natureza de sua realidade e seu papel na guerra contra seus controladores.',
    genero: ['Ação', 'Ficção Científica'],
    imagem_url: 'https://image.tmdb.org/t/p/original/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg'
  },
  {
    titulo: 'O Rei Leão',
    descricao: 'Um pequeno leão é obrigado por seu tío a fugir de casa e anos depois se da conta da sua identidade e suas responsabilidades.',
    genero: ['Animação', 'Drama'],
    imagem_url: 'https://m.media-amazon.com/images/M/MV5BNzJmNDVmNTAtODI3Mi00Y2Y2LTg4MDItNGI0ODE4NTQ1ZmNlXkEyXkFqcGc@._V1_QL75_UY562_CR25,0,380,562_.jpg'
  },
  {
    titulo: 'Vingadores',
    descricao: 'Um grupo com os maiores heróis da Terra é formado com o intuito de combater uma ameaça espacial que pode por em risco toda a raça humana.',
    genero: ['Ação', 'Aventura', 'Ficção Científica'],
    imagem_url: 'https://www.themoviedb.org/t/p/original/j9hwS307Zlc5mQTbAnwV75vXG0H.jpg'
  },
  {
    titulo: 'Harry Potter e a Pedra Filosofal',
    descricao: 'Harry Potter (Daniel Radcliffe) é um garoto órfão de 10 anos que vive infeliz com seus tios, os Dursley. Até que, repentinamente, ele recebe uma carta contendo um convite para ingressar em Hogwarts, uma famosa escola especializada em formar jovens bruxos. Inicialmente Harry é impedido de ler a carta por seu tio Válter (Richard Griffiths), mas logo ele recebe a visita de Hagrid (Robbie Coltrane), o guarda-caça de Hogwarts, que chega em sua casa para levá-lo até a escola. A partir de então Harry passa a conhecer um mundo mágico que jamais imaginara, vivendo as mais diversas aventuras com seus mais novos amigos, Rony Weasley (Rupert Grint) e Hermione Granger (Emma Watson).',
    genero: ['Aventura', 'Fantasia'],
    imagem_url: 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/95/59/60/20417256.jpg'
  }
];

async function setupDatabase() {
  try {
    console.log('Verificando e criando as estruturas do banco de dados...');

    const mediasTableCheck = await db.query(`SELECT to_regclass('public.medias');`); //Query para verificar se a tabela de filmes e series existe
    const tableExists = mediasTableCheck.rows[0].to_regclass !== null;

    if (!tableExists) { //Se não existe, cria a tabela e adiciona 5 filmes de exemplo
      console.log('Tabela medias não existe. Criando...');
      await db.query(createMediasTableQuery);
      
      console.log('Inserindo 5 filmes de exemplo...');
      for (const media of exemploMedias) {
        await db.query(
          `INSERT INTO medias (titulo, descricao, genero, imagem_url) VALUES ($1, $2, $3, $4)`,
          [media.titulo, media.descricao, JSON.stringify(media.genero), media.imagem_url]
        );
      }
      console.log('Filmes de exemplo adicionados com sucesso!');
    } else {
      console.log('Tabela medias já existe. Pulando a inserção de filmes.');
    }

    console.log('Criando a tabela de usuários...');
    await db.query(createUsuariosTableQuery);
    console.log('Tabela de usuários criada com sucesso!');
    
    console.log('Criando a tabela de votos...');
    await db.query(createVotosTableQuery);
    console.log('Tabela de votos criada com sucesso!');
    
    const adminUser = await db.query('SELECT id FROM usuarios WHERE login = $1', ['admin']); //verifica se existe usuario admin criado
    if (adminUser.rows.length === 0) {
      await db.query('INSERT INTO usuarios (login, senha) VALUES ($1, $2)', ['admin', 'admin']); //se não existe, cria novo usuario
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