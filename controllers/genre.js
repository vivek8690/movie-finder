/* eslint-disable max-len */
const Genre = require('../models/genre');
const { GENRES } = require('../constants/genre');

exports.getGenres = async(req, res, next) => {
    try {
        const genres = await Genre.find({})
            .select({ _id: false, __v: false })
            .sort({ createdAt: -1 }).lean();
        return res.status(200).json({ message: GENRES.GENRE_LIST, data: genres });
    } catch (err) {
        next(err);
    }
};
