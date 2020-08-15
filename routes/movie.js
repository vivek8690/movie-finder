const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movie');
const { isAdmin } = require('../middlewares/isAdmin');

router.post('/', isAdmin, movieController.create);
router.get('/', movieController.getMovies);
router.get('/:movieId', isAdmin, movieController.getMovie);
router.put('/:movieId', isAdmin, movieController.updateMovie);
router.delete('/:movieId', isAdmin, movieController.deleteMovie);

module.exports = router;
