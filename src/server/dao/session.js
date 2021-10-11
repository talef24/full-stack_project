const redisClient = require('../../db/redis');

async function isSessionExist(sessionID){
    return new Promise((resolve, reject) => {
        redisClient.get(`sess:${sessionID}`, (error, value) => {
            if (error) {
                reject(error);
            } else {
                if(value === null ) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }
        })
    });
}

module.exports = {
    isSessionExist
};


