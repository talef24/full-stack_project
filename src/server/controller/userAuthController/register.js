const userDAO = require('../../dao/user');
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');
const ApiError = require('../../error/ApiError');

async function register(req, res, next){
    try {
        const isEmailExists = await userDAO.checkIfEmailAlreadyExist(req.body.email);
        if(isEmailExists) {
            next(ApiError.badRequest("Email address is already in use"));
            return;
        } else {
            const userDetails = createUserObjToInsert(req.body);
            await userDAO.setUser(userDetails);
            res.sendStatus(201); //201 Created
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

function createUserObjToInsert(userDetails) {
    userDetails.type = "USER";
    userDetails.id = "user_" + uuid();
    userDetails.pwHash = bcrypt.hashSync(userDetails.password, 10);
    userDetails.logins = [];
    userDetails.logouts = [];
    userDetails.cart = [];
    userDetails.purchases = [];
    userDetails.sessions = [];
    delete userDetails.password;
    delete userDetails.repeatedPassword;

    return userDetails;
}

module.exports = {
    register
};