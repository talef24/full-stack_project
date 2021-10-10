const userDAO = require('../../dao/user');
const sessionDAO = require('../../dao/session');
const bcrypt = require('bcrypt');
const ApiError = require('../../error/ApiError');

async function login(req, res, next) {
    try {
        const {email, password, rememberMe} = req.body;
        if(rememberMe) {
            const twoWeeks = 1000 * 60 * 60 * 24 * 14;
            req.session.cookie.expires = new Date(Date.now() + twoWeeks)
        }
        const currentSession = req.session;
        currentSession.id = req.sessionID;
        setTimeout(() => onSessionExpires(currentSession), req.session.cookie.maxAge);
        const user = await userDAO.getUserByEmail(email);
        const match = await bcrypt.compare(password, user.pwHash);

        if (match) {
            req.session.user = {
                id: user.id,
                type: user.type,
            };
            await userDAO.updateUserLoginActivity("logins", user.id);
            res.status(200).json({userType: user.type});
        } else {
            next(ApiError.unauthorized('wrong username or password'));
            return;
        }

    } catch(err) {
        res.status(401).json(err.message);
    }
}

async function onSessionExpires(sessionWhenLoggedIn) {
    const isSessionExist = await sessionDAO.isSessionExist(sessionWhenLoggedIn.id);
    if(isSessionExist === true) { //The user didn't logout before session expired
        const userID = await sessionWhenLoggedIn.user.id;
        sessionWhenLoggedIn.destroy();
        await userDAO.updateUserLoginActivity("logouts", userID);
    }
}

module.exports = {
    login
};