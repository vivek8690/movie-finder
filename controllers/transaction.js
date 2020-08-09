/* eslint-disable space-before-function-paren */
/* eslint-disable max-len */
const mongoose = require('mongoose');
const Transaction = require('../models/transaction');
const Account = require('../models/account');
const { ErrorHandler } = require('../helpers/custom-error');
const { TRANSACTION } = require('../constants/transaction');

// create transaction between two accounts
exports.create = async (req, res, next) => {
    let isCompleted = false;
    let senderTotal, receiverTotal, sender, receiver, transaction;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        transaction = new Transaction(req.body);
        let { fromAccountId, toAccountId, amount } = req.body;
        amount = Number(amount);
        [sender, receiver] = await Promise.all([
            Account.findById(fromAccountId).session(session),
            Account.findById(toAccountId).session(session),
        ]);

        if (sender && receiver && amount > 0) {
            // same owner's account transfer is not allowed
            if (sender.customerName === receiver.customerName
                || sender._id === receiver._id) {
                throw new ErrorHandler(400,
                    TRANSACTION.SAME_ACCOUNT);
            }
            sender.balance = sender.balance - amount;
            // insufficient fund
            if (sender.balance < 0) {
                throw new ErrorHandler(400, TRANSACTION.INSUFFICIENT_FUND);
            }
            await sender.save();
            receiver.balance = receiver.balance + amount;

            // basic saving account balance limit
            if (receiver.accountType === 'basicsavings'
                && receiver.balance > 50000) {
                throw new ErrorHandler(400, TRANSACTION.BASIC_LIMIT);
            }
            await receiver.save();
            isCompleted = true;
            await session.commitTransaction();
            [senderTotal, receiverTotal] = await Promise.all([
                getTotalbalances(sender.customerName),
                getTotalbalances(receiver.customerName),
            ]);
        } else {
            throw new ErrorHandler(400, TRANSACTION.INVALID_TRANSACTION);
        }
    } catch (err) {
        await session.abortTransaction();
        next(err);
    } finally {
        transaction.isCompleted = isCompleted;
        transaction.save();
        session.endSession();
    }
    return res.status(200).json({
        data: {
            newSrcBalance: `Total balance of all accounts ${sender.customerName} = ${senderTotal[0].total}`,
            totalDestBalance: `Total balance of all accounts ${receiver.customerName} = ${receiverTotal[0].total}`,
            transferedAt: new Date().toString(),
        },
    });
};


exports.getTransactionsByAccount = async (req, res, next) => {
    try {
        const { accountId } = req.params;
        const transactions = await Transaction.find({ $or: [{ fromAccountId: accountId }, { toAccountId: accountId }] });
        return res.status(200).json({ message: TRANSACTION.ACCOUNT_TRANSACTIONS, data: transactions });
    } catch (err) {
        next(err);
    }

};

// calculate total balance in all account
const getTotalbalances = (customerName) => {
    return Account.aggregate().match({ customerName })
        .project({ customerName: 1, balance: { $divide: ['$balance', 100] } }).group({
            _id: '$customerName',
            total: {
                $sum: '$balance',
            },
        });
};
