const {Router} = require("express");
const {invalidIdMiddlware} = require("./helpers");
const httpStatus = require("http-status");
let productRouter = Router();
productRouter.param("id", (req,res,next,id) => {
    try {
        let productId = parseInt(id, 10);
        if(productId !== null && productId !== undefined) {
            req.productId = productId;
            return next();
        }else {
            return next();
        }
    } catch (error) {
        return next(new Error(error));
    }
});
productRouter.route("/products/:id?")
    .get((req,res,next) => {
        if(req.productId !== undefined && req.productId !== null) {
            return res.status(httpStatus.OK).json({ product: []});
        }else {
            return res.status(httpStatus.OK).json({ product: []});
        }
    }).post((req,res,next) => {

    }).put([invalidIdMiddlware], (req,res,next) => {
        //TODO! delete specific product by ID 
    }).delete([invalidIdMiddlware], (req,res,next) => {
        //TODO! delete specific product by ID 

    });
module.exports = Object.assign({}, {productRouter});