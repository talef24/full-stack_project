const express = require('express');
const router = express.Router();
const getPersonalDetailsController = require('../controller/userController/getPersonalDetails');
const getCartController = require('../controller/userController/getCart');

router.get('/getPersonalDetails', getPersonalDetailsController.getPersonalDetails);
router.get('/getCart', getCartController.getCart);

module.exports = router;