const express = require('express');
const votoDAO = require('../DAO/votoDAO')
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const totais = await votoDAO.getVotosTotais();
    res.json(totais);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter totais de votos.' });
  }
});
router.get('/reacao/:mediaId', async (req, res) => {
  const { mediaId } = req.params;
  const usuarioId = req.user.id;

  try {
    const reacao = await votoDAO.getReacaoDoUsuario(usuarioId, mediaId);
    res.status(200).json({ reacao });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar a reação do usuário.' });
  }
});

router.post('/', async (req, res) => {
  const {  mediaId, reacao } = req.body;
  const usuarioId = req.user.id;

  if (!usuarioId || !mediaId || typeof reacao !== 'boolean') {
    return res.status(400).json({ error: 'Dados do voto inválidos. mediaId e reacao (true/false) são obrigatórios.' });
  }

  try {
    const voto = await votoDAO.votar(usuarioId, mediaId, reacao);
    res.status(200).json(voto);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar voto.' });
  }
});

router.delete('/', async (req, res) => {
  const { usuarioId, mediaId } = req.body;

  if (!usuarioId || !mediaId) {
    return res.status(400).json({ error: 'Dados do voto inválidos. usuarioId e mediaId são obrigatórios.' });
  }

  try {
    const isRemoved = await votoDAO.removerVoto(usuarioId, mediaId);

    if (isRemoved) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Voto não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover voto.' });
  }
});

module.exports = router;