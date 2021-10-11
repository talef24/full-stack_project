const generalDAO = require('../../dao/general');

async function getItems(req, res) {
    try {
        const items = await generalDAO.getAllValues("items");
        res.status(200).json(items);
    } catch(error) {
        res.status(400).json(error);
    }
}

module.exports = {
    getItems
}