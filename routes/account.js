const express = require('express');
const router = express.Router();

const accountController = require('../controllers/account');

router.post('/', accountController.create);
router.get('/', accountController.getAll);
router.get('/:accountID', accountController.getAccountDetails);

module.exports = router;
