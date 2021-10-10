const redis = require('redis');

//Configure redis client:
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});

module.exports = redisClient;