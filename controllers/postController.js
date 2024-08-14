const Post = require("../model/posts"); //模組化Post 使用大寫
const User = require("../model/users"); //模組化User 使用大寫
const Comments = require("../model/comments"); //模組化User 使用大寫
const handleSuccess = require("../service/handleSuccess");
const mongoose = require("mongoose");
const appError = require("../service/appError");

const getPosts = async (req, res, next) => {
  const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt"; //createdAt由舊到新搜尋
  const keyword = req.query.keyword !== undefined ? { content: new RegExp(req.query.keyword, "i") } : {};

  let size = 50;
  if (req.query.size) {
    size = parseInt(req.query.size) > 50 ? 50 : parseInt(req.query.size);
  }
  const post = await Post.find(keyword)
    .populate({
      path: "user", //因為Post.find，所以指向Post model裡頭的user欄位
      select: "name photo email sex",
    })
    .populate({
      path: "comments",
      select: "comment user",
    })
    .populate({
      path: "likes",
      select: "name",
    })
    .sort(timeSort)
    .limit(size);
  if (post.length !== 0) {
    return handleSuccess(res, post, `目前共有${post.length}則貼文`);
  } else return handleSuccess(res, "尚未有任何貼文");
};

//****post****
const postPosts = async (req, res, next) => {
  const { content } = req.body;
  if (content != undefined && content.trim()) {
    const new_post = await Post.create({ user: req.user._id, content });
    return handleSuccess(res, "新增貼文成功", new_post);
  } else {
    return next(appError(400, "你沒有填寫 content 資料"));
  }
};

const likspost = async (req, res, next) => {
  const _id = req.params.id;
  if (!(await Post.findById({ _id: _id }))) {
    return next(appError(400, "沒有此貼文"));
  }
  await Post.findOneAndUpdate({ _id }, { $addToSet: { likes: req.user.id } });
  res.status(201).json({
    status: true,
    postId: _id,
    userId: req.user.id,
  });
};

const deletelikepost = async (req, res, next) => {
  const _id = req.params.id;
  if (!(await Post.findById({ _id: _id }))) {
    return next(appError(400, "沒有此貼文"));
  }
  await Post.findOneAndUpdate({ _id }, { $pull: { likes: req.user.id } });
  res.status(201).json({
    status: true,
    postId: _id,
    userId: req.user.id,
  });
};

const getuserpost = async (req, res, next) => {
  const user = req.params.id;
  const posts = await Post.find({ user }).populate({
    path: "comments",
    select: "comment user",
  });

  res.status(200).json({
    status: true,
    results: posts.length,
    posts,
  });
};

const postcomment = async (req, res, next) => {
  const user = req.user.id;
  const post = req.params.id;
  const { comment } = req.body;

  if (!(await Post.findOne({ _id: post }))) {
    return next(appError(400, "沒有此貼文"));
  }

  const newComment = await Comments.create({
    post,
    user,
    comment,
  });
  res.status(201).json({
    status: true,
    data: {
      comments: newComment,
    },
  });
};

const getonePost = async (req, res, next) => {
  const id = req.params.id;
  let post = await Post.findOne({ _id: id })
    .populate({
      path: "user",
      select: "name",
    })
    .populate({
      path: "comments",
      select: "comment",
    })
    .populate({
      path: "likes",
      select: "name",
    });

  if (post) {
    return res.status(200).json({
      status: true,
      data: post,
    });
  }
  return next(appError(404, "無此 post ID"));
};

module.exports = {
  getPosts,
  postPosts,
  likspost,
  deletelikepost,
  getuserpost,
  postcomment,
  getonePost,
};
