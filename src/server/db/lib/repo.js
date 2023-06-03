const {getSection,getItemProperties} = require("./helpers");
class ProductRepo {
    constructor({db, sql}) {
        this._db = db;
        this._sql = sql;        
    }
    createTable() {
        return new Promise((resolve, reject) => {
            this._db.query(this._sql`create table if not exists products(id INTEGER primary key, productId TEXT not null,name TEXT not null, description TEXT, price REAL,count INTEGER);`).then(result => {
                return resolve(result);
            }).catch(error => {
                return reject(error.message);
            });
        });
    }
    getProductById(id) {
        return new Promise((resolve, reject) => {
            this._db.query(this._sql`select * from products where id=${id};`).then(result => {
                return resolve(result);
            }).catch(error => {
                return reject(error);
            });
        });
    }
    getProducts() {
        return new Promise((resolve, reject) => {
            this._db.query(this._sql`select * from products;`).then(result => {
                return resolve(result);
            }).catch(error => {
                return reject(error);
            });
        });
    }
    createProduct(item) {
        return new Promise((resolve, reject) => {
            try {
                if(item !== null && item !== undefined) {
                    this._db.query(this._sql`INSERT INTO products(id,productId,name,description,price,count) values(${item.id},${item.productId},${item.name},${item.description},${item.price},${item.count}) RETURNING id;`).then(result => {
                        return resolve(result[0].id);
                    }).catch(error => {
                        return reject(error);
                    });
                }else {
                    return reject(new Error("invalid input"));
                }
            } catch (error) {
                return reject(new Error(error));
            }
        });
    }
    updateProduct(id, item) {
        return new Promise(async (resolve, reject) => {
            try {
                if(id !== null && id !== undefined && item !== null && item !== undefined) {
                    let product = await this.getProductById(id);
                    if(product !== undefined && product !== null) {
                        let props = await getItemProperties(item);
                        let x = `UPDATE products SET ${props} where id=${id};`;
                        console.log(x);
                        this._db.query(this._sql`UPDATE products SET productId=${item.productId},name=${item.name},price=${item.price},description=${item.description},count=${item.count} where id=${id} returning id;`).then(result => {
                            console.log(result);
                            return resolve(result[0].id);
                        }).catch(error => {
                            return reject(error);
                        });
                    }else{
                        return reject(new Error("product does not found!"));
                    }
                }else {
                    return reject(new Error("invalid input"));
                }
            } catch (error) {
                return reject(new Error(error));
            }
        });

    }
    deleteProduct(id) {
        return new Promise(async (resolve, reject) => {
            try {
                if(id !== null && id !== undefined ) {
                    let product = await this.getProductById(id);
                    if(product !== undefined && product !== null) {
                        this._db.query(this._sql`delete from products where id=${id} RETURNING Id;`).then(result => {
                            return resolve(result[0].id);
                        }).catch(error => {
                            return reject(error);
                        });
                    }else{
                        return reject(new Error("product does not found!"));
                    }
                }else {
                    return reject(new Error("invalid input"));
                }
            } catch (error) {
                return reject(new Error(error));
            }
        });
    }
}

module.exports = Object.assign({}, {ProductRepo});