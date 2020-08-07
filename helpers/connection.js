/* eslint-disable max-len */
/* eslint-disable strict */
/* eslint-disable no-undef */
const mongoose = require('mongoose');

console.log('process.env.NODE_ENV:', process.env.NODE_ENV);

const DB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017,localhost:27018,localhost:27019/banking';

mongoose.connect(DB_URL, { replicaSet: 'rs' });

const db = mongoose.connection;

db.once('open', () => {
    console.log(`Database connected on with ${DB_URL}`);
});

db.on('error', (err) => {
    console.error('connection error:', err);
});
