const {productGenerator} = require("../../helpers");

class ProductMockRepo {
    constructor() {
        this.products = [];
    }
    async seedRepo({number}) {
        return Promise.all([...Array(number)].map((_,i) => {
            return productGenerator(i).next().value;
        })).then((result) => {
            this.products = result;
            return Promise.resolve(result);
        }).catch((error) => {
            return Promise.reject(error);
        });
    }
    getProductById(id) {
        return new Promise((resolve, reject) => {    
            let product = this.products.find((item) => {
                return item.id == id;
            });
            if (product !== null && product !== undefined) {
                return resolve(product);
            }else {
                return reject(new Error("not found!"));
            }
        });
    }
    getProducts() {
        return Promise.resolve(this.products);
    }
    createProduct(item) {
        return new Promise((resolve, reject) => {    
            this.products.push(item);
            return resolve(item.id);
        });
    }
    updateProduct(id, item) {
        return new Promise((resolve, reject) => {    
            try {
                let product = this.products.find((item) => {
                    return item.id == id;
                });
                if(product !== null && product !== undefined) {
                    let index = this.products.indexOf(product);
                    this.products[index].name = item.name;
                    this.products[index].description = item.description;
                    this.products[index].price = item.price;
                    this.products[index].count = item.count;
                    return resolve(this.products[index].id);
                }else {
                    return reject(new Error("product not found!"));
                }
            } catch (error) {
                return reject(new Error(error.message));
            }
        });
    }
    deleteProduct(id) {
        return new Promise((resolve, reject) => {    
            let product = this.products.find((item) => {
                return item.id == id;
            });
            if (product !== null && product !== undefined) {
                let index = this.products.indexOf((item) => { return item.id == id; });
                this.products.splice(index,1);
                return resolve(product.id);
            }else {
                return reject(new Error("not found!"));
            }
        });
    }
    
}
module.exports = Object.assign({}, {
    getItemProperties : async function(item) {
        let queryString = ``;
        let keys = Object.keys(item);
        for await (let x of keys) {
            let str = keys.indexOf(x) != keys.length-1  ? `${getString(x,item[x])},` : `${getString(x,item[x])}`;
            queryString += str;
        }
        return queryString;
    },
    ProductMockRepo
});
const getString = function(key, value) {
    if(key !== null && key !== undefined && value !== null && value !== undefined) {
        if(typeof(value) === 'number') {
            return `${key}=${value}`;
        }else if(typeof(value) === 'string') {
            return `${key}='${value}'`;
        }else if(typeof(value) === 'boolean') {
            let val =  value == true ? 1 : 0;
            return `${key}='${val}'`;
        }
    }else {
        return new Error("invalid parameters");
    }
}