const { data } = require('../data/data');
const Movie = require('../models/movie');

exports.init = async() => {
    try {
        const documents = await Movie.countDocuments({});
        if (documents < 1) {
            Movie.insertMany(data);
        }
    } catch (err) {
        console.log(err);
    }
};
