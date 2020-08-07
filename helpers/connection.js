/* eslint-disable max-len */
/* eslint-disable strict */
/* eslint-disable no-undef */
const mongoose = require('mongoose');

const DB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017,localhost:27018,localhost:27019/banking';

mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true, replicaSet: 'rs' });

const db = mongoose.connection;

db.once('open', () => {
    console.log(`Database connected on with ${DB_URL}`);
});

db.on('error', (err) => {
    console.error('connection error:', err);
});
