const {GraphQLError} = require("graphql");
const resolvers = {
    Query :{
        getPing : () => {
            return { "ping" : "pong" };
        },
        greeting: () => "Hello World!",
        getPerson: () => {
            return {
                "first_name" : "ali",
                "last_name" : "taherian"
            }
        },
        getProducts: async (parent, args, contextValue, info) => {
            try {
                let products = await contextValue.productRepo.getProducts();
                return products;
            }catch(err) {
                throw new GraphQLError(`Database Error : ${err}`, {
                    extensions : { code : 'Database Error'}
                });
            }
        }
    }
}
module.exports = Object.assign({},{resolvers});