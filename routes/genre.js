const express = require('express');
const router = express.Router();

const movieController = require('../controllers/genre');

router.get('/', movieController.getGenres);

module.exports = router;
