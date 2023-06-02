module.exports = {
    "invalidIdMiddlware" : function (req,res,next) {
        if(req.productId !== null && req.productId !== undefined) {
            return next();
        }else {
            return next(new Error("invalid input parameters"));
        }
    }
}