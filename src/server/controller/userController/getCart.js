const productsDAO = require('../../dao/products');

async function getCart(req, res, next){
    try{
        const cart = req.session.user.cart ? req.session.user.cart : [];
        let packages = [];

        for (let i = 0; i < cart.length; i++){
            let currentPackage = cart[i];
            if(currentPackage.id.includes('builtPackage')){
                packages.push(currentPackage);
            } else {
                const packageData = await productsDAO.getProduct("packages", currentPackage.id);
                packageData.picSrc = "packages/" + packageData.picSrc.toString();
                packageData.amount = currentPackage.amount;
                packageData.card = currentPackage.card;
                packages.push(packageData);
            }
        }
        res.status(200).json(packages);
    } catch (err) {
        //res.status(401).json(err);
        next(err);
    }
}

module.exports = {
    getCart
};
