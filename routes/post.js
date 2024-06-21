const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../model/posts");
const postController = require("../controllers/postController");

const { isAuth } = require("../service/auth");
const handleErrorAsync = require("../service/handleErrorAsync");

router
  .get("/", [isAuth, handleErrorAsync(postController.getPosts)]) //取得所有貼文
  .get("/:id", [isAuth, handleErrorAsync(postController.getonePost)]) //取得單一貼文
  .post("/", [isAuth, handleErrorAsync(postController.postPosts)]) //新增貼文
  .get("/user/:id", [isAuth, handleErrorAsync(postController.getuserpost)]) //取得個人所有貼文列表
  .post("/:id/comment", [isAuth, handleErrorAsync(postController.postcomment)]) //新增一則貼文的留言
  .post("/:id/likes", [isAuth, handleErrorAsync(postController.likspost)]) //新增一則貼文的讚
  .delete("/:id/unlikes", [isAuth, handleErrorAsync(postController.deletelikepost)]); //取消一則貼文的讚

module.exports = router;
