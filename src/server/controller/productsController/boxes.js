const generalDAO = require('../../dao/general');

async function getBoxes(req, res) {
    try {
        const boxes = await generalDAO.getAllValues("boxes");
        res.status(200).json(boxes);
    } catch(error) {
        res.status(400).json(error);
    }
}

module.exports = {
    getBoxes
}