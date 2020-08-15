/* eslint-disable max-len */
/* eslint-disable strict */
const mongoose = require('mongoose');
const Genre = require('../models/genre');

const { Schema } = mongoose;

const setGenre = (genre) => {
    genre.forEach(async(name) => {
        try {
            const options = { upsert: true };
            name ? await Genre.findOneAndUpdate({ type: name }, { type: name }, options) : '';
        } catch (err) {
            console.log('already exist');
        }
    });
    return genre;
};

const MovieSchema = new Schema({
    name: {
        type: String,
        required: 'Movie name is required field',
        immutable: true,
    },
    popularity: {
        type: Number,
        required: 'Popularity is required field',
    },
    director: {
        type: String,
        required: 'Director name is required field',
    },
    genre: {
        type: [{ type: String, trim: true }],
        required: 'Genre is required field',
        set: setGenre,
    },
    imdb_score: {
        type: Number,
        required: 'IMDB score is required field',
    },
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
