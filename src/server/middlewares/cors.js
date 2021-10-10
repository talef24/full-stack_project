const cors = require('cors');
const ApiError = require('../error/ApiError');

const whitelist = new Set(["http://localhost:3000"]);
const corsOptions = {
    optionsSuccessStatus: 200,
    origin: function(origin, callback) {
        if (whitelist.has(origin)) {
            callback(null, true);
        } else {
            callback(ApiError.forbidden('Not allowed by CORS'));
        }
    },
    credentials: true //Configures the Access-Control-Allow-Credentials CORS header. Set to true to pass the header
};

module.exports = cors(corsOptions);
