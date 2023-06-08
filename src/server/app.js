const express = require("express");
const logger =require("morgan");
const path = require("path");
const status = require("http-status");
const {routesSetup} = require("./routes");

const initApp = function({repos}) {
    return new Promise((resolve,reject) => {
        let app = express();
        app.use(logger("dev"));
        app.use("/client",express.static(path.resolve(__dirname,"../","client")));
        app.use(express.json());
        app.get("/", (req,res) => {
            // return res.sendFile(path.resolve(__dirname, "../../","index.html"));
            return res.sendFile(path.resolve(__dirname,"../","client","app","home.html"));
        });
        app.use((req,res,next) => {
           req.repos = repos;
           return next();
        });
        routesSetup({app});
        app.use((req,res,next) => {
            let err = new Error("Not Found!");
            return next(err);
        });
        app.use((err,req,res,next) => {
            if(err.message === "Not Found!") {
                return res.status(status.NOT_FOUND).json({message: err.message , error: err});
            }else {
                return res.status(status.INTERNAL_SERVER_ERROR).json({error: err , message: err.message});
            }
        });
        return resolve(app);
    });
}
module.exports = Object.assign({}, {initApp});


