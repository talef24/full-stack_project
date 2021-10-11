const generalDAO = require("../../dao/general");

async function filterPackageByText(req, res) {
    const textToFilterBy = req.params.textToSearch.toLowerCase();
    const allPackages = await generalDAO.getAllValues("packages");
    const filteredPackages = allPackages.filter(packageData =>
        packageData.tags.join().toLowerCase().includes(textToFilterBy));
    res.status(200).json(filteredPackages);
}

module.exports = {
    filterPackageByText
};