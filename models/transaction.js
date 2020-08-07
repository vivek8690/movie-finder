/* eslint-disable strict */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const TransactionSchema = new Schema({
    fromAccountId: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
    },
    toAccountId: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
    },
    amount: {
        type: Number,
        required: 'Amount is required',
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
