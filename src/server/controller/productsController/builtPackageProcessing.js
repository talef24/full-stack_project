const productsDAO = require('../../dao/products');
const { v4: uuid } = require('uuid');
const updateCart = require('../userController/updateCart');

async function builtPackageProcessing(req, res){
    try {
        const packageValidation = isValidPackage(req.body);
        if(!packageValidation.isPackageValid) {
            res.status(400).json(packageValidation);
        } else {
            const builtPackageToInsert = await createBuiltPackageObject(req.body);
            await updateCart.updateShoppingCart(req, builtPackageToInsert, "add");
            res.sendStatus(204);
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

function isValidPackage(productsIDs){ //one box & at least one item
    let validationDetails = {
        box: productsIDs.chosenBox !== null,
        items: productsIDs.chosenItems.length >= 2
    }

    return {
        isPackageValid: !Object.values(validationDetails).includes(false),
        validationDetails: validationDetails
    }
}

async function createBuiltPackageObject(productsIDs) {
    const chosenItemsIDs = productsIDs.chosenItems;
    const chosenBoxID = productsIDs.chosenBox;
    const chosenItemsArr = await getChosenItemsObjects(chosenItemsIDs);
    const boxObject = await productsDAO.getProduct("boxes", chosenBoxID);

    return {
        picSrc: `boxes/${boxObject.picSrc}`,
        price: getBuiltPackageTotalPrice(chosenItemsArr),
        products: chosenItemsArr.map(itemObj => itemObj.description),
        id: "builtPackage_" + uuid(),
        card: [{"wishes": "", "type": 0, "size": 0, "display": 0, "price": 0}],
        amount: 1
    };
}

async function getChosenItemsObjects(chosenItemsIDs) {
    try {
        const chosenItems = await Promise.all(chosenItemsIDs.map(async (itemID) => {
            return await productsDAO.getProduct("items", itemID);
        }));
        return Promise.resolve(chosenItems);
    } catch(error) {
        return Promise.reject(error);
    }
}

function getBuiltPackageTotalPrice(chosenItemsObjects) {
    const chosenItemsPricesArr = chosenItemsObjects.map(itemObj => parseInt(itemObj.price));
    return chosenItemsPricesArr.reduce((sum, current) => sum + current, 0);
}

module.exports = {
    builtPackageProcessing
};