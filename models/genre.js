const mongoose = require('mongoose');

const { Schema } = mongoose;

const GenreSchema = new Schema({
    type: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Genre', GenreSchema);
