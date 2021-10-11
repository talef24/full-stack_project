const userDAO = require('../../dao/user');
const bcrypt = require('bcrypt');
const ApiError = require('../../error/ApiError');

async function changePassword(req, res, next) {
    const {password} = req.body;

    try {
        const userID = req.session.user.id;
        const user = await userDAO.findUserById(userID);
        const identical = await bcrypt.compare(password, user.pwHash);
        if(identical){
            next(ApiError.badRequest('The new password is identical to the previous password - you need to provide a different password'));
            return;
        }else{
            user.pwHash = bcrypt.hashSync(`${password}`, 10);
            await userDAO.setUser(user);
            res.sendStatus(200);
        }
    } catch (err){
        res.status(400).json(err.message);
    }
}
module.exports = {
    changePassword
};
