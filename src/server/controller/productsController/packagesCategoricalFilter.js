const generalDAO = require('../../dao/general');

async function filterPackagesByCategory(req, res){
    try {
        const allPackages = await generalDAO.getAllValues("packages");
        const category = req.params.category;
        const minimum = parseInt(req.params.minVal);
        const maximum = parseInt(req.params.maxVal);
        const gender = req.params.gender;
        const filterPackages = allPackages.filter(pac => passFilter(pac, category, minimum, maximum, gender));
        res.status(200).json(filterPackages);
    } catch (error) {
        res.status(400).json(error);
    }
}

function passFilter(item, category, minimum, maximum, gender){
    const passCategory = (item.category.toLowerCase() === category.toLowerCase());
    const price = parseInt(item.price);
    const passPrice = ((price >= minimum) && (price <= maximum));
    const passGender = (item.gender.toLowerCase() === gender.toLowerCase());
    return (passCategory && passPrice && passGender);
}

module.exports = {
    filterPackagesByCategory
}