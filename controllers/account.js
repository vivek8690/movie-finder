const Account = require('../models/account');
const { ErrorHandler } = require('../helpers/custom-error');
const { ACCOUNT } = require('../constants/account');

exports.create = async(req, res, next) => {
    try {
        const { accountType, customerName } = req.body;
        const isAccount = !!await isAccountExist(accountType, customerName);
        if (isAccount) {
            throw new ErrorHandler(409, ACCOUNT.ACCOUNT_EXISTS);
        }
        const account = new Account(req.body);
        await account.save();
        return res.status(200)
            .json({ message: ACCOUNT.ACCOUNT_CREATED, data: account });
    } catch (error) {
        next(error);
    }
};

const isAccountExist = (accountType, customerName) => {
    return Account.findOne({ accountType, customerName });
};

exports.getAccountDetails = async(req, res, next) => {
    try {
        const { accountID } = req.params;
        const accounts = await Account.findById(accountID);
        return res.status(200)
            .json({ message: ACCOUNT.ACCOUNT_DETAILS, data: accounts });
    } catch (error) {
        next(error);
    }
};

exports.getAll = async(req, res, next) => {
    try {
        const accounts = await Account.find({});
        return res.status(200)
            .json({ message: ACCOUNT.ACCOUNTS_FETCHED, data: accounts });
    } catch (error) {
        next(error);
    }
};
