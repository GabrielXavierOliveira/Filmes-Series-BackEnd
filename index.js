const express = require("express")
const cors = require('cors');

require('dotenv').config();
var app = express()
const port = process.env.PORT || 8080

app.use(cors());
app.use(express.json());

const setupDatabase = require('./src/setup'); //inicialização o banco de dados se vazio
const authMiddleware = require('./src/middleware/auth'); //middleware para autenticação

//Modulo que contem os metodos de cada recurso
const mediaRoutes = require('./src/routes/media');
const voteRoutes = require('./src/routes/vote');
const usuarioRoutes = require('./src/routes/usuario')

//Define rotas do sistema, com middleware de autenticação para operações
app.use('/Medias',authMiddleware, mediaRoutes)
app.use('/Votos',authMiddleware, voteRoutes)
app.use('/Auth',usuarioRoutes)

const startServer = async () => {//inicialização do server
  try {
    await setupDatabase(); //realizar a inicialização do banco de dados
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();