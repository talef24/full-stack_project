const redisClient = require('../../db/redis');
const bcrypt = require('bcrypt');

async function insertAdmins() {
    const adminInfo = {
        email: "admin@ppp.com",
        password: 'Admin1pass!',
        id: 'admin_41c514f4-7288-4199-80c0-e0be7e4353d7',
        firstName: "adminFirstName",
        lastName: "adminLastName",
        address: "sesame 20",
        city: "Tel-Aviv",
        region: "center",
        telephone: "050-1234567",
    };
    const admin_testInfo = {
        email: "adminTest@ppp.com",
        password: 'Admin1test!',
        id: 'adminTest_4199-80c0-e0be7e4353d7-41c514f4-7288',
        firstName: "admin_testFirstName",
        lastName: "admin_testLastName",
        address: "Balfur 20",
        city: "Tel-Aviv",
        region: "center",
        telephone: "054-7654321",
    };

    await insertAdmin(admin_testInfo);
    await insertAdmin(adminInfo);
}


function insertAdmin(adminInfo) {
    const adminToInsert = {
        email: adminInfo.email,
        pwHash: bcrypt.hashSync(adminInfo.password, 10),
        type: 'ADMIN',
        id: adminInfo.id,
        firstName: adminInfo.firstName,
        lastName: adminInfo.lastName,
        address: adminInfo.address,
        city: adminInfo.city,
        region: adminInfo.region,
        telephone: adminInfo.telephone,
        purchases: [],
        logins: [],
        logouts: [],
        cart: [],
    };
    //Check if user already exist - if not, insert it.
    return new Promise((resolve, reject) => {
        redisClient.hget('users', adminToInsert.id, (error, value) => {
            if (error) {
                reject(error);
            } else {
                if(value === null){
                    redisClient.hset("users", adminToInsert.id, JSON.stringify(adminToInsert));
                }
                resolve();
            }
        })
    });
}

function getPartialUserData(fieldsToKeep, userData) {
    let partialUserData = {};

    fieldsToKeep.forEach(field => {
        partialUserData[field] = userData[field]
    });

    return partialUserData;
}

async function getAllValues(key) {
    return new Promise((resolve, reject) => {
        redisClient.hgetall(key.toLowerCase(), (error, values) => {
            if (error) {
                reject(error);
            } else {
                const arr = createDataArray(values);
                resolve(arr);
            }
        })
    });
}

function createDataArray(dataFromDB){
    const data = [];

    for (let i in dataFromDB) {
        data.push(JSON.parse(dataFromDB[i]));
    }

    return data;
}

module.exports = {
    getAllValues,
    getPartialUserData,
    insertAdmins
};