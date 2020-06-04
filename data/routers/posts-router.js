//import express and the data
const express = require("express");
const Posts = require("../db.js");

//import router from express
const router = express.Router();

//------->>endpoints start here: /api/posts<<----------

//When the client makes a GET request to /api/posts:
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

//When the client makes a GET request to /api/posts/:id:
router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post[0]) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "post not found" });
      }
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the post",
      });
    });
});

//When the client makes a POST request to /api/posts:
router.post("/", (req, res) => {
  const post = req.body;

  if (!post.title || !post.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    try {
      Posts.insert(post);
      res.status(201).json(post);
    } catch {
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    }
  }
});

//When the client makes a DELETE request to /api/posts/:id:

router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then((post) => {
      if (post && post > 0) {
        res.status(200).json({ message: "The post has been deleted" });
      } else {
        res.status(404).json({ message: "The post could not be found" });
      }
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error removing the post",
      });
    });
});

//When the client makes a PUT request to /api/posts/:id:
router.put("/:id", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res
      .status(400)
      .json({ errorMessage: "Please provide title and contents for the post" });
  } else {
    Posts.update(req.params.id, req.body)
      .then((item) => {
        if (item) {
          res.status(200).json({ ...req.body, id: req.params.id });
        } else {
          res.status(404).json({
            message: "The post with the speciefied ID does not exist",
          });
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({ error: "The post informationd could not be modified." });
      });
  }
});

//When the client makes a GET request to /api/posts/:id/comments:

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  Posts.findCommentById(id)
    .then((comment) => {
      if (comment.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(comment);
      }
    })
    .catch((error) => {
      console.log(error, "Status 500");
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

//When the client makes a POST request to /api/posts/:id/comments:
router.post("/:id/comments", (req, res) => {
  const id = req.params.id;
  const comment = req.body;

  if (!comment.text) {
    res.status(400).json({ message: "no text" });
  } else {
    Posts.insertComment({ post_id: id, ...comment }).then((comment) => {
      if (comment === 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist.",
        });
      } else {
        try {
          res.status(201).json({ id: comment.id, post_id: id, ...req.body });
        } catch {
          console.log(error, "500 error");
          res.status(500).json({
            error: "There was an error while saving the post to the database",
          });
        }
      }
    });
  }
});

module.exports = router;
