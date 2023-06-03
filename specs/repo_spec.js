const should = require("should");
const {initializeRepo} = require("../src/server/db");
const {productGenerator} =require("../src/server/helpers");
const {saveProducts} = require("../src/server/helpers");
describe('Repositories', function(){ 
    describe('Product Repository', function(){
        let productRepo;
        let products;
        before(async function() {
            productRepo = await initializeRepo();
            let result = await productRepo.createTable();
            let newProduct = productGenerator(0).next().value;
            let insertResult = await productRepo.createProduct(newProduct);
        });
        it("returns only one product successfully", async() => {
            products = await productRepo.getProducts();
            should(products).has.length(1);
        });
        it("update product by id successfully", async() => {
            let productId = products[0].id;
            let editedProduct = products[0];
            editedProduct.name = "x";
            let result = await productRepo.updateProduct(productId, editedProduct);
            should(result).be.eql(1);
        });
        it("delete product by id successfully", async() => {
            let productId = products[0].id;
            let result = await productRepo.deleteProduct(productId);
            should(result).be.eql(1);
        });
        it("seed 100 product successfully", async() => {
            let productNumber = 100;
            let result = await saveProducts({productRepo, productNumber});
            should(result).length(100);
        });
    });
});