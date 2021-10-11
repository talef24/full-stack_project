const express = require('express');
const router = express.Router();
const updateUserInfoController = require('../controller/userController/updateUserInfo');
const logoutController = require('../controller/userController/logout');
const paymentController = require('../controller/userController/payment');
const changePasswordController = require('../controller/userController/changePassword');
const updateCartController = require('../controller/userController/updateCart');

router.put('/updatePersonalDetails', updateUserInfoController.updatePersonalDetails);
router.put('/changePassword', changePasswordController.changePassword);
router.post('/updateCart', updateCartController.updateCart);
router.post('/logout', logoutController.logout);
router.post('/payment', paymentController.payment);

module.exports = router;