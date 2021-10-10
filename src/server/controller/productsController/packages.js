const generalDAO = require('../../dao/general');

async function getPackages(req, res) {
    try {
        const packages = await generalDAO.getAllValues("packages");
        res.status(200).json(packages);
    } catch(error) {
        res.status(400).json(error);
    }
}

module.exports = {
    getPackages
}