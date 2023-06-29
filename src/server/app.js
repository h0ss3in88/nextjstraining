const express = require("express");
const logger = require("morgan");
const path = require("path");
const status = require("http-status");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { resolvers, getSchema } = require("./graphQl");
const { routesSetup } = require("./routes");

const initApp = function ({ repos }) {
  return new Promise(async (resolve, reject) => {
    try {
      let app = express();
      app.use(logger("dev"));
      app.use(cors());
      app.use("/public",express.static(path.resolve(__dirname,"../","../","node_modules")));
      app.use(
        "/client",
        express.static(path.resolve(__dirname, "../", "client"))
      );
      app.use(express.json());
      app.get("/", (req, res) => {
        return res.sendFile(path.resolve(__dirname, "../../", "index.html"));
      });
      let typeDefs = getSchema();
      app.use((req, res, next) => {
        req.repos = repos;
        return next();
      });
      let apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer: app })],
      });
      await apolloServer.start();
      routesSetup({ app });
      app.use('/graphql',expressMiddleware(apolloServer, {
        context : async ({req,res}) => ({
          productRepo : req.repos.productRepo
        })
      }));

      app.use((req, res, next) => {
        let err = new Error("Not Found!");
        return next(err);
      });
      app.use((err, req, res, next) => {
        if (err.message === "Not Found!") {
          return res
            .status(status.NOT_FOUND)
            .json({ message: err.message, error: err });
        } else {
          return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json({ error: err, message: err.message });
        }
      });
      return resolve(app);
    } catch (error) {
      return reject(error);
    }
  });
};
module.exports = Object.assign({}, { initApp });
