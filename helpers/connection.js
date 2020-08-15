/* eslint-disable max-len */
/* eslint-disable strict */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const { init } = require('../helpers/data-feed');

const DB_URL = process.env.DATABASE_URL || 'mongodb+srv://vivek123:vivek123456@cluster0.7oiq4.mongodb.net/movies-listing?authSource=admin&replicaSet=atlas-8lvchi-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true';

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
