const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transaction');

router.post('/', transactionController.create);
router.get('/:accountId', transactionController.getTransactionsByAccount);

module.exports = router;
