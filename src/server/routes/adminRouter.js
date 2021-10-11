const express = require('express');
const router = express.Router();
const getUsersActivityController = require('../controller/adminController/getUsersActivity');

router.get('/getUsersActivity', getUsersActivityController.getUsersActivity);
router.get('/getFilteredUsersActivity/:filterValue', getUsersActivityController.getFilteredUsersActivity);

module.exports = router;