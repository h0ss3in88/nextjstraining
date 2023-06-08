const {sql} = require("@databases/sqlite");
const connect = require("@databases/sqlite");
const {ProductRepo} = require("./lib/repo");
const {ProductMockRepo} = require("./lib/helpers");
const getDb = function(dbFileName) {
    return new Promise((resolve, reject) => {
        try {
            let obj = {};
            dbFileName !== undefined || dbFileName !== null ? Object.defineProperties(obj, { "sql" : { configurable: true, value: sql, enumerable: true }, 
                        "db" : { configurable: true, enumerable: true, value: connect(dbFileName) }}) :  
                        Object.defineProperties(obj, { "sql" : { configurable: true, value: sql, enumerable: true }, 
                                            "db" : { configurable: true, enumerable: true, value: connect() }});
            return resolve(obj);
        } catch (error) {
            return reject(error.message);
        }
    });
}
const initializeRepo = function() {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await getDb();
            let productRepo = new ProductRepo({db: result.db, sql: result.sql});
            return resolve({productRepo});
        } catch (error) {
            return reject(new Error(error.message));
        }
    });
}
module.exports = Object.assign({}, {initializeRepo, ProductMockRepo});