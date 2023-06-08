const {faker} = require("@faker-js/faker");
const createProductsArray = function(number) {
    return new Promise((resolve,reject) => {
        try {
            console.log(number);
            let products = [...Array(number)].fill().map(function(_,i) {
                return productGenerator(i).next().value;
            });
            return resolve(products);
        } catch (error) {
            console.log(error);
            return reject(new Error(error));
        }
    });
}
function* productGenerator(i){
    yield {
        id: ++i,
        productId: faker.string.uuid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        count: faker.number.int({min: 0,max: 350})
    }  
}
const generateArray = async function(number) {
    try {
        let products = [];
        for (let i = 0; i < number; i++) {
            products.push(productGenerator(i).next().value);
        }
        return await products;
    } catch (error) {
        return error;
    }
}
async function saveProducts({productRepo, productNumber}) {
    try {
        let products = await generateArray(productNumber);
        console.log(products.length);
        let results = [];
        for await (let product of products) {
            let result = await productRepo.createProduct(product);
            results.push(result);
        }
        console.log(2);
        console.log(results.length);
        return results;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }    
}
module.exports = Object.assign({}, {productGenerator,createProductsArray,saveProducts});