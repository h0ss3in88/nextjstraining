const {body, validationResult} = require("express-validator");
module.exports = {
    "invalidIdMiddlware" : function (req,res,next) {
        if(req.productId !== null && req.productId !== undefined) {
            return next();
        }else {
            return next(new Error("invalid input parameters"));
        }
    },
    "checkProductUpdate" : [
        body("productName").notEmpty().escape().withMessage("name should not be empty"),
        body("productId").notEmpty().isUUID("4").escape().withMessage("should not be empty"),
        body("price").notEmpty().isNumeric().isCurrency().escape().withMessage("price should not be empty | should be numeric"),
        body("count").notEmpty().isNumeric().escape().withMessage("invalid value for count property"),
        body("description").isLength({ min: 0 ,max: 550}).escape(),
        function(req,res,next) {
            let errorResult = validationResult(req);
            if(!errorResult.isEmpty()) {
                let errors = errorResult.array({onlyFirstError: false }).map((error) => {
                    return { "message" : error.msg, "path": error.path };
                })
                let errorMessage = `invalid inputs ${errors}`;
                return next(new Error(errorMessage));
            }
            next();
        }
    ]
    
}