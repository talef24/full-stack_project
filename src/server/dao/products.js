const redisClient = require('../../db/redis');

function initProducts(productType, allProductsData){
    allProductsData.forEach(productData => {
        redisClient.hset(productType, productData.productId, JSON.stringify(productData));
    });
}

async function getProduct(productType, productID) {
    return new Promise((resolve, reject) => {
        redisClient.hget(productType, productID, (error, value) => {
            if (error) {
                reject(error);
            } else {
                if(value === null){
                    reject('Product not found');
                }
                resolve(JSON.parse(value));
            }
        })
    });
}

module.exports = {
    initProducts,
    getProduct,
};