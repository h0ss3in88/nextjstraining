const express = require("express");
const logger =require("morgan");
const path = require("path");
const {createServer} = require("http");
let app = express();
app.use(logger("dev"));
app.use("/client",express.static(path.resolve(__dirname,"../","client")));
app.get("/", (req,res) => {
    return res.sendFile(path.resolve(__dirname, "../../","index.html"));
});
let server = createServer(app);
server.listen(3200, () => {
    console.log(`server is running at ${server.address().address}:${server.address().port}`);
})
