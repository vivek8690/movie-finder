/* eslint-disable space-before-function-paren */
/* eslint-disable max-len */
const Movie = require('../models/movie');
const { MOVIES } = require('../constants/movie');
const { ErrorHandler } = require('../helpers/custom-error');

// create new movie
exports.create = async (req, res, next) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.status(200).json({ message: MOVIES.CREATED, data: movie });
    } catch (err) {
        next(err);
    }
};

// get movie details
exports.getMovie = async (req, res, next) => {
    let { movieId } = req.params;
    try {
        const movie = await Movie.findById(movieId);
        if (movie == null) {
            console.log('in error handler');
            throw new ErrorHandler(400, MOVIES.NOT_EXIST);
        }
        res.status(200).json({ message: MOVIES.FETCHED, data: movie });
    } catch (err) {
        next(err);
    }
};

// update movie details
exports.updateMovie = async (req, res, next) => {
    let { movieId } = req.params;
    try {
        const movie = await Movie.findById(movieId);
        if (movie == null) {
            throw new ErrorHandler(400, MOVIES.NOT_EXIST);
        }
        Object.keys(req.body).map((key) => {
            movie[key] = req.body[key];
        });
        await movie.save();
        res.status(200).json({ message: MOVIES.UPDATED, data: movie });
    } catch (err) {
        next(err);
    }
};

// delete movie details
exports.deleteMovie = async (req, res, next) => {
    let movie;
    let { movieId } = req.params;
    try {
        movie = await Movie.findByIdAndRemove(movieId);
        if (movie == null) {
            console.log('in error handler');
            throw new ErrorHandler(400, MOVIES.NOT_EXIST);
        }
        res.status(200).json({ message: MOVIES.DELETED, data: movie });
    } catch (err) {
        next(err);
    }
};


// filter movies
exports.getMovies = async (req, res, next) => {
    try {
        let { sortBy, genre, search } = req.query;
        search = search || '';
        const sortObj = {};
        sortObj[sortBy] = -1;
        let query = {};
        if (genre) {
            query['genre'] = { $all: genre };
        }
        query['$or'] = [
            { name: { $regex: search, $options: 'i' } },
            { director: { $regex: search, $options: 'i' } },
        ];
        const movies = await Movie.find(query)
            .sort(sortObj).lean();
        res.status(200).json({ message: MOVIES.MOVIE_LIST, data: movies });
    } catch (err) {
        next(err);
    }
};

