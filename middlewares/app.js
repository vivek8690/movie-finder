/* eslint-disable strict */
const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const accountRouter = require('../routes/account');
const transactionRouter = require('../routes/transaction');
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/accounts', accountRouter);
app.use('/transactions', transactionRouter);

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
