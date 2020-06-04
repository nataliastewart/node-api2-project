//import express and the data
const express = require("express");
const Posts = require("../db.js");

//import router from express
const router = express.Router();

//endpoints start here: /api/posts

router.get("/", (req, res) => {
  Posts.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error retrieving the posts" });
    });
});

module.exports = router;
