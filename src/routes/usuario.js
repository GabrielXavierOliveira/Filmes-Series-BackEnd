const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const usuarioDAO = require('../DAO/usuarioDAO');
const router = express.Router();

const jwtSecret = process.env.JWT_SECRET || 'um-segredo-muito-secreto';

const validateLogin = [
  body('login').notEmpty().withMessage('O login é obrigatório.'),
  body('senha').notEmpty().withMessage('A senha é obrigatória.'),
];

router.post('/Login', validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { login, senha } = req.body;

  try {
    const user = await usuarioDAO.findByLogin(login);
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    if (senha !== user.senha) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const payload = { id: user.id, login: user.login };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
    res.json({ id:user.id, token });

  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor.' });
  }
});
router.post('/Registro', validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { login, senha } = req.body;

  try {
    const existingUser = await usuarioDAO.findByLogin(login);
    if (existingUser) {
      return res.status(409).json({ error: 'Este login já está em uso.' });
    }

    const newUser = await usuarioDAO.createUser(login, senha);

    res.status(201).json({ 
      message: 'Usuário criado com sucesso!',
      id: newUser.id,
      login: newUser.login
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erro ao criar o usuário.' });
  }
});

module.exports = router;