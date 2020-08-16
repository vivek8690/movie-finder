/* eslint-disable max-len */
/* eslint-disable strict */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const { init } = require('../helpers/data-feed');

// pass databse connection URI here
const DB_URL = process.env.DATABASE_URL;

mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

const db = mongoose.connection;

db.once('open', () => {
    console.log(`Database connected on with ${DB_URL}`);
});

process.nextTick(() => {
    init();
});

db.on('error', (err) => {
    console.error('connection error:', err);
});
