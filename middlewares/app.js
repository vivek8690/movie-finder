/* eslint-disable strict */
const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const movieRouter = require('../routes/movie');
const genreRouter = require('../routes/genre');
const { handleError, ErrorHandler } = require('../helpers/custom-error');

const app = express();

require('../helpers/connection');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}
app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/movies', movieRouter);
app.use('/api/genres', genreRouter);

app.use((req, res, next) => {
    const err = new ErrorHandler(401, `${req.url} route not found`);
    next(err);
});

/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
    handleError(err, res);
});

/* eslint-enable no-unused-vars */

module.exports = app;
