const { createServer } = require("http");
const { initApp } = require("./src/server/app");
const { initializeRepo } = require("./src/server/db");
const { saveProducts } = require("./src/server/helpers");
require('dotenv').config();
(function() { initializeRepo().then(async ({ productRepo }) => {
    console.log("repositories initialized successfully");
    let productNumber = parseInt(process.env.PRODUCT_NUMBER, 10);
    await productRepo.createTable();
    saveProducts({productRepo, productNumber }).then((result) => {
        console.log(typeof(result.length),typeof(productNumber));
        if(parseInt(result.length,10) === parseInt(productNumber, 10)) {
            console.log("seed database successfully");
            let repos = {productRepo};
            initApp({ repos }).then(app => {
                let server = createServer(app);
                server.listen(process.env.PORT_NUMBER || 3200, () => {
                    console.log(`server is running at ${server.address().address}:${server.address().port}`);
                });
            }).catch(error => {
                console.log(error);
                process.exit(0);
            });
        }else {
            console.log(error);

            process.exit(0);
        }
    }).catch(error => {
        console.log(error);

            process.exit(0);
    });

}).catch(error => {
    console.log(error);
    process.exit(0);
});
})();