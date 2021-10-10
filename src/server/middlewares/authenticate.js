const ApiError = require('../error/ApiError');

function authenticate(req, res, next) {
    if (!req.session || !req.session.user) {
        next(ApiError.unauthorized('You must login before'));
        return;
    }
    next();
}

module.exports = authenticate;