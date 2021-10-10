const userDAO = require('../../dao/user');

async function payment(req, res) {
    try {
        if(req.session.user.cart.length > 0) {
            const userID = req.session.user.id;
            const userData = await userDAO.findUserById(userID);
            if(!userData.purchases) {
                userData.purchases = [];
            }
            userData.purchases.push(new Date().toLocaleString());
            userData.cart = [];
            req.session.user.cart = [];
            await userDAO.setUser(userData);
            res.sendStatus(204);
        } else {

        }
    } catch(error) {
        res.status(400).json(error);
    }
}

module.exports = {
    payment
}