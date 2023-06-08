const {Router} = require("express");
const {invalidIdMiddlware,checkProductUpdate} = require("./helpers");
const httpStatus = require("http-status");
const {v4 : uuid} = require("uuid");
let productRouter = Router();
productRouter.param("id", (req,res,next,id) => {
    try {
        let productId = parseInt(id, 10);
        if(productId !== null && productId !== undefined) {
            req.productId = parseInt(productId, 10);
            return next();
        }else {
            return next();
        }
    } catch (error) {
        return next(new Error(error));
    }
});
productRouter.route("/products/:id?")
    .get(async (req,res,next) => {
        try {
            if(req.productId !== undefined && req.productId !== null) {
                let product = await req.repos.productRepo.getProductById(req.productId);
                return res.status(httpStatus.OK).json({ product});
            }else {
                let products = await req.repos.productRepo.getProducts();
                return res.status(httpStatus.OK).json({ products });
            }
        } catch (error) {
            return next(new Error(error.message));
        }    
    }).post(async (req,res,next) => {
        try {

            let productId = uuid();

            let {id,name,description,price,count} = req.body.product;
            //TODO check inputs 
            //TODO add uuid as productId
            let item = { id,name,productId, description,price,count};
            //TODO save product
            let result = await req.repos.productRepo.createProduct(item);
            return result > 0 ? res.status(httpStatus.CREATED).json({ message : "product saved successfully", success: true , product : item}) : 
                next(new Error("unable to save product into database. try again!"));
        } catch (error) {
            return next(new Error(error.message));
        }
    }).put([invalidIdMiddlware,checkProductUpdate], async (req,res,next) => {
        //TODO! update specific product by ID 
        try {
            let productId = req.productId;
            let editedProduct = {id: productId, productId: req.body.productId, name: req.body.productName, description: req.body.description, price: req.body.price, count: req.body.count };
            let result = await req.repos.productRepo.updateProduct(productId, editedProduct);
            return result > 0 && result === productId ? res.status(httpStatus.OK).json({ message : `product by product id of ${productId} edited successfully`, success : true , updatedId : result }) : next(new Error("unable to update product"));
        } catch (error) {
            return next(new Error(error.message));
        }
    }).delete([invalidIdMiddlware], async (req,res,next) => {
        //TODO! delete specific product by ID 
        try {
            let productId = req.productId;
            let result = await req.repos.productRepo.deleteProduct(productId);
            return result > 0 && result == productId ? res.status(httpStatus.OK).json({ success : true , message : `product by id ${productId} deleted successfully.`, deletedId: result}) : res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: new Error(`unable to delete product by id = ${productId} try again later ...`)});
        }catch(error) {
            return next(new Error(error.message));
        }
    });
module.exports = Object.assign({}, {productRouter});