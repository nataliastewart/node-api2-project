const express = require("express");

//import tthe routers
const postsRouter = require("./data/routers/posts-router");

const server = express();

//middleware
server.use(express.json());

// use routes and endpoints
server.use("/api/posts", postsRouter); //everything that BEGINS with /api/posts, all that trafic i will give to the Router

server.listen(8000, () => {
  console.log("\n*** Server Running on http://localhost:8000 ***\n");
});
