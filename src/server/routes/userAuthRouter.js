const express = require('express');
const router = express.Router();
const loginController = require('../controller/userAuthController/login');
const registerController = require('../controller/userAuthController/register');
const loginDetailsController = require('../controller/userAuthController/getLoginDetails');

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/getLogin', loginDetailsController.getLoginDetails);


module.exports = router;