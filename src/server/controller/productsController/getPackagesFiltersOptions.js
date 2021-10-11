const generalDAO = require('../../dao/general');

async function getPackagesFiltersOptions(req, res) {
    const allPackages = await generalDAO.getAllValues("packages");
    const pricesRange = getPricesRange(allPackages);
    const filtersOptions =  {
        minimalPrice: pricesRange.minimalPrice,
        maximalPrice: pricesRange.maximalPrice,
        categories: getUniqueFieldValues(allPackages, "category"),
        genders: getUniqueFieldValues(allPackages, "gender")
    }
    res.status(200).json(filtersOptions);
}

function getPricesRange(packages) {
    const packagesPrices = packages.map(packageData => packageData.price);

    return {
        minimalPrice: Math.min(...packagesPrices),
        maximalPrice: Math.max(...packagesPrices)
    }
}

function getUniqueFieldValues(arrOfObjects, fieldInObj) {
    return Array.from(new Set(arrOfObjects.map(obj => obj[fieldInObj].toLowerCase())));
}

module.exports = {
    getPackagesFiltersOptions
}


