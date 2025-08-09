const express = require("express")
const cors = require('cors');

require('dotenv').config();
var app = express()
const port = process.env.PORT || 8080

app.use(cors());
app.use(express.json());

const setupDatabase = require('./src/setup'); 
const authMiddleware = require('./src/middleware/auth');

const mediaRoutes = require('./src/routes/media');
const voteRoutes = require('./src/routes/vote');
const usuarioRoutes = require('./src/routes/usuario')

app.use('/Medias',authMiddleware, mediaRoutes)
app.use('/Votos',authMiddleware, voteRoutes)
app.use('/Auth',usuarioRoutes)

const startServer = async () => {
  try {
    await setupDatabase();
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();