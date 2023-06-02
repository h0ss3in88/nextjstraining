const {faker} = require("@faker-js/faker");
const should = require("should");
describe.skip("Javascript Generator fucntion", function () {
    function *productGenerator() {
        let product = {
            id: faker.string.uuid(),
            name : faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            material : faker.commerce.productMaterial()
        };
        yield product
    }
    it("geenrate a product successfully", () => {
        let product = productGenerator().next();
        let secondProduct = productGenerator().next();
        should(product.value).hasOwnProperty("id");
        should(secondProduct.value).hasOwnProperty("id");
        console.log(product);
        console.log(secondProduct);
    });
    it("javascript Geenrator Function with Arrays", () => {
        let products = Array(10).fill().map((_,i) => productGenerator().next());
        should(products).has.length(10);
        console.log(products[8]);
    });
    it("javascript Geenrator Function with Spere Arrays", () => {
        let products = [...Array(10).fill().map(() => productGenerator().next())];
        should(products).has.length(10);
        console.log(products[8]);
    });
});
