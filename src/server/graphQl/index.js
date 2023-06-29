const {resolvers} = require("./lib/resolvers");
const fs = require("fs");
const path = require("path");
const getSchema = function() {
    return fs.readFileSync(path.resolve(__dirname, "./lib","schema.graphql"), { encoding: "utf-8"});
};

module.exports = Object.assign({}, {resolvers, getSchema});