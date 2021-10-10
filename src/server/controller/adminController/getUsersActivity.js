const userDAO = require('../../dao/user');

async function getUsersActivity(req, res) {
    try {
        const usersActivity = await userDAO.getAllUsersActivity();
        res.status(200).json(usersActivity);
    } catch(error) {
        res.status(403).json(error);
    }
}

async function getFilteredUsersActivity(req, res) {
    try {
        const strToFilterBy = req.params.filterValue;
        const filteredUsersActivity = await userDAO.getFilteredUsersActivity(strToFilterBy);
        res.status(200).json(filteredUsersActivity);
    } catch(error) {
        res.status(403).json(error);
    }
}

module.exports = {
    getUsersActivity,
    getFilteredUsersActivity
}