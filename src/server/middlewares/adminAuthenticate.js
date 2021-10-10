const ApiError = require('../error/ApiError');

function adminAuthenticate(req, res, next) {
    if (req.session.user.type.toUpperCase() !== "ADMIN") {
        next(ApiError.forbidden('User does not have permissions to access here'));
        return;
    }

    next();
}

module.exports = adminAuthenticate;