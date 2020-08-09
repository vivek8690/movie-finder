const Account = require('../models/account');
const { ACCOUNT } = require('../constants/account');

exports.create = async(req, res, next) => {
    try {
        let account = new Account(req.body);
        account = await account.save();
        return res.status(200)
            .json({ message: ACCOUNT.ACCOUNT_CREATED, data: account });
    } catch (error) {
        next(error);
    }
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
