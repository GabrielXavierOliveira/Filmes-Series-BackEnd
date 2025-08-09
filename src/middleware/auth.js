const jwt = require('jsonwebtoken');

// Lembre-se de usar a mesma chave secreta do seu arquivo .env
const jwtSecret = process.env.JWT_SECRET || 'um-segredo-muito-secreto';

const authMiddleware = (req, res, next) => {
  // 1. Pega o token do cabeçalho de autorização
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  // O cabeçalho geralmente vem no formato "Bearer TOKEN"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token mal formatado.' });
  }

  try {
    // 2. Tenta verificar e decodificar o token
    const decoded = jwt.verify(token, jwtSecret);
    
    // 3. Anexa o payload decodificado (id e login) à requisição
    req.user = decoded; 
    
    // 4. Continua para a próxima função na rota
    next();
  } catch (err) {
    // Se o token for inválido, retorna um erro 401
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

module.exports = authMiddleware;