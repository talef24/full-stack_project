async function getLoginDetails(req, res) {
    let isAdmin = false;
    const isLoggedIn = req.session !== undefined && req.session.user !== undefined;
    if(isLoggedIn) {
        isAdmin = req.session.user.type.toUpperCase() === "ADMIN";
    }
    res.status(200).json(loginDetailsObject(isLoggedIn, isAdmin));
}

function loginDetailsObject(isLoggedIn, isAdmin) {
    return {
        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
    }
}

module.exports = {
    getLoginDetails
}