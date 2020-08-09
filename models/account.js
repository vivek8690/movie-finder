// eslint-disable-next-line strict
const mongoose = require('mongoose');

const { Schema } = mongoose;

const isBalanceExceeds = function () {
    if (this.accountType === 'basicsavings') {
        return this.balance <= 50000;
    }
    return true;
};

const getBalance = (balance) => {
    return (balance / 100);
};

const setBalance = (balance) => {
    return (balance * 100);
};

const AccountSchema = new Schema({
    accountType: {
        type: String,
        enum: ['savings', 'current', 'basicsavings'],
    },
    customerName: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
        get: getBalance,
        set: setBalance,
        validate: [isBalanceExceeds, `balance should
         not exceed 50,000 in  BasicSavings`],
    },
}, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
});

module.exports = mongoose.model('Account', AccountSchema);
