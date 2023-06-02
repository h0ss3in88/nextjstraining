const {pingRouter} = require("./lib/ping");
const {productRouter} = require("./lib/products");

const routesSetup = function ({app}) {
    app.use("/api",pingRouter);
    app.use("/api", productRouter);
}
module.exports = Object.assign({},{routesSetup});