/* eslint-disable space-before-function-paren */
/* eslint-disable max-len */
const mongoose = require('mongoose');
const Transaction = require('../models/transaction');
const Account = require('../models/account');
const { ErrorHandler } = require('../helpers/custom-error');

// create transaction between two accounts
exports.create = async (req, res, next) => {
    let isCompleted = false;
    let trancsaction;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        trancsaction = new Transaction(req.body);
        let { fromAccountId, toAccountId, amount } = req.body;
        amount = Number(amount);
        const sender = await Account.findById(fromAccountId).session(session);
        const reciever = await Account.findById(toAccountId).session(session);

        if (sender && reciever && amount > 0) {
            // same owner's account transfer is not allowed
            if (sender.customerName === reciever.customerName
                || sender._id === reciever._id) {
                throw new ErrorHandler(400,
                    'you can\'t transfer between accounts owned by you');
            }
            sender.balance = sender.balance - amount;
            // insufficient fund
            if (sender.balance < 0) {
                throw new ErrorHandler(400, 'you don\'t have sufficient fund');
            }
            await sender.save();
            reciever.balance = reciever.balance + amount;

            // basic saving account balance limit
            if (reciever.accountType === 'basicsavings'
                && reciever.balance > 50000) {
                throw new ErrorHandler(400, 'basic savings can have max 50,000');
            }
            await reciever.save();
            isCompleted = true;
            await session.commitTransaction();
        } else {
            throw new ErrorHandler(400, 'Invalid transaction');
        }
        return res.status(200).json({
            data: {
                newSrcBalance: `${sender.customerName} = ${sender.balance}`,
                totalDestBalance: `${reciever.customerName} = ${reciever.balance}`,
                transferedAt: new Date().toString(),
            },
        });
    } catch (err) {
        await session.abortTransaction();
        next(err);
    } finally {
        trancsaction.isCompleted = isCompleted;
        trancsaction.save();
        session.endSession();
    }
};


exports.getTransactionsByAccount = async (req, res, next) => {
    try {
        const { accountId } = req.params;
        const transactions = await Transaction.find({ $or: [{ fromAccountId: accountId }, { toAccountId: accountId }] });
        return res.status(200).json({ message: 'transactions of this account', data: transactions });
    } catch (err) {
        throw new ErrorHandler(400, 'Something went wrong');
    }

};