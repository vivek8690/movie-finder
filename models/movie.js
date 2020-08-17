/* eslint-disable max-len */
/* eslint-disable strict */
const mongoose = require('mongoose');
const Genre = require('../models/genre');

const { Schema } = mongoose;

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
    },
    imdb_score: {
        type: Number,
        required: 'IMDB score is required field',
    },
}, { timestamps: true });

MovieSchema.pre('save', function(next) {
    console.log('pre save hook', this.genre);
    this.genre.map(async(name) => {
        try {
            const options = { upsert: true };
            await Genre.findOneAndUpdate({ type: name }, { type: name }, options);
        } catch (err) {
            console.log('something wrong');
        }
    });
    next();
});

MovieSchema.pre('insertMany', function(next, docs) {
    docs.forEach(async(doc) => {
        doc.genre.map(async(name) => {
            try {
                const options = { upsert: true };
                await Genre.findOneAndUpdate({ type: name }, { type: name }, options);
            } catch (err) {
                console.log('already exist');
            }
        });
    });
    next();
});

module.exports = mongoose.model('Movie', MovieSchema);
