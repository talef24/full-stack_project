const userDAO = require('../../dao/user');

async function updatePersonalDetails (req, res) {
    try {
        const userID = req.session.user.id;
        const userData = await userDAO.findUserById(userID);
        const updatedUserData = updateUserDataObj(userData, req.body);
        await userDAO.setUser(updatedUserData); //Update in DB
        res.status(200).json(JSON.stringify(updatedUserData))
    } catch(err) {
        res.status(400).json(err.message);
    }
}

function updateUserDataObj(userData, dataToUpdate) {
    const keysToUpdate = Object.keys(dataToUpdate);

    keysToUpdate.forEach(key => {
        userData[key] = dataToUpdate[key];
    });

    return userData;
}

module.exports = {
    updatePersonalDetails
};