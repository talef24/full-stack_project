const express = require('express');
const router = express.Router();
const packagesController = require('../controller/productsController/packages');
const itemsController = require('../controller/productsController/items');
const boxesController = require('../controller/productsController/boxes');
const builtPackageController = require('../controller/productsController/builtPackageProcessing');
const packagesTextualFilter = require('../controller/productsController/packagesTextualFilter');
const packagesFiltersOptionsController = require('../controller/productsController/getPackagesFiltersOptions');
const filterPackagesController = require('../controller/productsController/packagesCategoricalFilter');

router.get('/packages', packagesController.getPackages);
router.get('/items', itemsController.getItems);
router.get('/boxes', boxesController.getBoxes);
router.post('/processBuiltPackage', builtPackageController.builtPackageProcessing);
router.get('/search/:textToSearch', packagesTextualFilter.filterPackageByText);
router.get('/packagesFiltersOptions', packagesFiltersOptionsController.getPackagesFiltersOptions);
router.get('/filter/:category/:minVal/:maxVal/:gender', filterPackagesController.filterPackagesByCategory);

module.exports = router;

