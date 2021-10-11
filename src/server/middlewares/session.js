const session = require('express-session');
const connectRedis = require('connect-redis');
const redisClient = require('../../db/redis');

//configure redis:
const RedisStore = connectRedis(session);

//Configure session middleware:
const sessionMw = session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secret$%^134',
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: true, // if true prevent client side JS from reading the cookie
        maxAge: 1000 * 60 * 30, //1000- ms per seconds, 60- seconds per minute
    }
});

module.exports = sessionMw;