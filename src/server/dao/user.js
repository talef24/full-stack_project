const redisClient = require('../../db/redis');
const generalDAO = require('./general');
const ApiError = require('../error/ApiError');

async function updateUserData(userID, dataToUpdate) { //Gets only what needs to be updated, the rest stays the same
    try {
        const userData = await findUserById(userID);
        const updatedUserData = await updateUserDataObj(userData, dataToUpdate);
        await setUser(updatedUserData);
        return Promise.resolve("User's data updated successfully");
    } catch(error) {
        return Promise.reject(error);
    }
}

function updateUserDataObj(userData, dataToUpdate) {
    const keysToUpdate = Object.keys(dataToUpdate);
    keysToUpdate.forEach(key => {
        const newValue = dataToUpdate[key];
        if(typeof(userData[key]) === "object") {
            if(Array.isArray(userData[key])) {
                userData[key].push(newValue);
            }
        } else {
            userData[key] = newValue;
        }
    });

    return userData;
}

async function updateUserLoginActivity(activity, userID) {
    try {
        const userDetails = await findUserById(userID);
        if(activity !== "logins" && activity !== "logouts") {
            return Promise.reject("Wrong activity name !");
        }
        if(!userDetails[activity]) {
            userDetails[activity] = [];
        }
        userDetails[activity].push(new Date().toLocaleString());
        await setUser(userDetails);
        return Promise.resolve("Login activity updates successfully");
    } catch(error) {
        return Promise.reject(error);
    }
}

async function getAllUsersActivity() {
    try {
        const allUsersData = await generalDAO.getAllValues("users");
        const activityDetails = ["firstName", "logins", "logouts", "purchases"];
        const usersActivity = await allUsersData.map(userData => generalDAO.getPartialUserData(activityDetails, userData));
        return Promise.resolve(usersActivity);
    } catch(error) {
        return Promise.resolve(error);
    }
}

async function getFilteredUsersActivity(filter) {
    const allUsersActivity = await getAllUsersActivity();
    return await allUsersActivity.filter(userData =>
        userData.firstName.toString().toLowerCase().startsWith(filter.toLowerCase()));
}

async function setUser(userDetails) {
    return new Promise((resolve, reject) => {
        redisClient.hset("users", userDetails.id , JSON.stringify(userDetails), (error) => {
            if (error) {
                reject("Error occurred while inserting user to DB");
            } else {
                resolve();
            }
        });
    });
}

async function checkIfEmailAlreadyExist(email) {
    const userArr = await findUserByEmail(email);
    return userArr.length !== 0; //true = already exist
}

async function getUserByEmail(email) {
    try {
        const userArr = await findUserByEmail(email);
        return userArr.length !== 0 ? userArr[0] : Promise.reject(ApiError.unauthorized("User not found"));
    } catch(error) {
        return Promise.reject(error);
    }
}

async function findUserByEmail(email) {
    try {
        const users = await generalDAO.getAllValues("users");
        const requiredUser = users.filter(user => user.email === email);
        return Promise.resolve(requiredUser);
    } catch(error) {
        return Promise.reject(error);
    }
}

async function findUserById(id) {
    return new Promise((resolve, reject) => {
        redisClient.hget('users', id, (error, value) => {
            if (error) {
                reject(error);
            } else {
                if(value === null){
                    reject('user not found');
                }
                resolve(JSON.parse(value));
            }
        })
    });
}

module.exports = {
    getUserByEmail,
    findUserById,
    setUser,
    checkIfEmailAlreadyExist,
    getAllUsersActivity,
    getFilteredUsersActivity,
    updateUserLoginActivity,
    updateUserData
};