const userDAO = require('../../dao/user');

async function logout(req, res) {
    try {
        const userID = await req.session.user.id;
        req.session.destroy();
        await userDAO.updateUserLoginActivity("logouts", userID);
        res.sendStatus(204);
    } catch(error) {
        res.status(400).json(error);
    }
}

module.exports = {
    logout
}