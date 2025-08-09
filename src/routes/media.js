const express = require('express');
const mediaDAO = require('../DAO/mediaDAO');
const router = express.Router();

const products = [
  { id: 1, name: 'Resgate' },
  { id: 2, name: 'Miranha' },
];

router.get('/', async (req, res) => {
    const filters = {
    titulo: req.query.titulo,
    genero: req.query.genero,
  };
  
  const options = {
    orderBy: req.query.orderBy,
    orderDirection: req.query.orderDirection,
  };
  try {
    const medias = await mediaDAO.findMedias(filters, options);
    res.json(medias);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar filmes ou series' });
  }
});
router.get('/:id', async (req, res) => {
  const mediaId = parseInt(req.params.id);

  if (isNaN(mediaId)) {
    return res.status(400).json({ error: 'ID de mídia inválido.' });
  }

  try {
    const media = await mediaDAO.findById(mediaId);

    if (media) {
      res.json(media);
    } else {
      res.status(404).json({ error: 'Mídia não encontrada.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar mídia.' });
  }
});

router.post('/', async (req, res) => {
  const { titulo, descricao, genero, imagem_url } = req.body;

  if (!titulo || !genero || !imagem_url) {
    return res.status(400).json({ error: 'Título, gênero e imagem_url são obrigatórios.' });
  }
  
  if (!Array.isArray(genero)) {
    return res.status(400).json({ error: 'O gênero deve ser um array de strings.' });
  }

  const newMediaData = {
    titulo,
    descricao,
    genero,
    imagem_url,
  };

  try {
    const newMedia = await mediaDAO.createMedia(newMediaData);
    res.status(201).json(newMedia); // Retorna 201 Created com a nova mídia
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar mídia.' });
  }
});

router.put('/:id', async (req, res) => {
  const mediaId = parseInt(req.params.id);

  if (isNaN(mediaId)) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  const updateData = req.body;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'Corpo da requisição vazio. Nenhum dado para atualizar.' });
  }

  if (updateData.genero && !Array.isArray(updateData.genero)) {
    return res.status(400).json({ error: 'O gênero deve ser um array de strings.' });
  }

  try {
    const updatedMedia = await mediaDAO.updateMedia(mediaId, updateData);
    
    if (updatedMedia) {
      res.json(updatedMedia);
    } else {
      res.status(404).json({ error: 'Mídia não encontrada.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar mídia.' });
  }
});

module.exports = router;