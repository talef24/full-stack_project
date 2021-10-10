const userDAO = require('../../dao/user');
const generalDAO = require('../../dao/general');
const personalDetails = ["email", "firstName", "lastName", "address", "city", "region", "telephone"];

async function getPersonalDetails(req, res) {
    try {
        const userID = req.session.user.id;
        const userData = await userDAO.findUserById(userID);
        const userInfo = await generalDAO.getPartialUserData(personalDetails, userData);
        res.status(200).json(JSON.stringify(userInfo));
    } catch(error) {
        res.status(400).json(error);
    }
}

module.exports = {
    getPersonalDetails,
};