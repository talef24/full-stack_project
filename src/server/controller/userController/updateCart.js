const userDAO = require('../../dao/user');

async function updateCart(req, res){
    const {selectedPackage, updateType} = req.body;
    const cart = req.session.user.cart;

    if(cart){  //cart exist
        switch(updateType) {
            case "add":
                req.session.user.cart = addToCart(cart, selectedPackage);
                break;
            case "remove":
                req.session.user.cart = removeFromCart(cart, selectedPackage);
                break;
            default:
                res.status(400).json("Update type is not existed");
                break;
        }
    } else{
        req.session.user.cart = [selectedPackage];
    }

    try {
        const userID = req.session.user.id;
        const user = await userDAO.findUserById(userID);
        user.cart = req.session.user.cart;
        await userDAO.setUser(user);
        res.sendStatus(200);
    }catch (err){
        res.status(400).json(err);
    }
}

function addToCart(cart, selectedPackage){
    let updatedCart = cart;
    const packageInCart = cart.filter(pac => pac.id === selectedPackage.id);

    if(packageInCart.length !== 0){  //the package already exist in cart
        updatedCart = cart.map(pac => {
            if(pac.id === selectedPackage.id){
                pac.amount++;
                pac.card.push(selectedPackage.card[0]);
            }
            return pac;
        });
    }else{ //the package is not in cart
        updatedCart.push(selectedPackage);
    }

    return updatedCart;
}

function removeFromCart(cart, selectedPackage){
    return cart.flatMap(pac => {
        if(pac.id === selectedPackage.id){
            pac.amount--;
        }

        return pac.amount === 0 ? [] : pac;
    });
}

async function updateShoppingCart(req, selectedPackage, updateType) {
    try {
        const cart = req.session.user.cart;
        let updatedCart = cart ? cart : [];
        const indexInCart = updatedCart.findIndex(pac => pac.id === selectedPackage.id);
        switch(updateType) {
            case "add":
                indexInCart === -1 ? updatedCart.push(selectedPackage) : updatedCart[indexInCart].amount++;
                break;
            case "remove":
                updatedCart = removeFromCartTal(updatedCart, indexInCart);
                break;
            default:
                return Promise.reject("Update type is not existed");
        }

        await setUpdatedCart(req, updatedCart);
    } catch (err){
        return Promise.reject(err);
    }
}

function removeFromCartTal(cart, indexInCart){
    if(indexInCart !== -1) {
        cart[indexInCart].amount--;
        if(cart[indexInCart].amount === 0) {
            cart[indexInCart] = [];
        }
    }

    return cart.flat();
}

async function setUpdatedCart(req, updatedCart) {
    try {
        req.session.user.cart = updatedCart; //Update in the session
        await userDAO.updateUserData(req.session.user.id, {cart: updatedCart}); //Update in DB
    } catch (err){
        return Promise.reject(err);
    }
}


module.exports = {
    updateCart,
    updateShoppingCart,
};