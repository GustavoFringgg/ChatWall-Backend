const Post = require("../model/posts"); //模組化Post 使用大寫
const User = require("../model/users"); //模組化User 使用大寫
const Comments = require("../model/comments"); //模組化User 使用大寫
const handleSuccess = require("../service/handleSuccess");
const mongoose = require("mongoose");
const appError = require("../service/appError");

//****get****
const getPosts = async (req, res, next) => {
  /* #swagger.tags = ['Posts']
     * #swagger.description = 'Posts successfully obtained.'
     * #swagger.responses[200] = {
      description: "posts info",
      schema: {
          "status": true,
          "message": [
              {
                  "_id": "6662bc9c17654aceed98d988",
                  "user": {
                      "_id": "665d385fdc5fdb708aa120e7",
                      "name": "Mary",
                      "photo": "https://thumb.fakeface.rest/thumb_female_30_8ab46617938c195cadf80bc11a96ce906a47c110.jpg"
                  },
                  "likes": 0,
                  "content": "5",
                  "image": "",
                  "createdAt": "2024-06-07T07:54:04.995Z"
              }
          ]
      }
      }
     */

  const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt"; //由舊到新搜尋
  const q = req.query.q !== undefined ? { content: new RegExp(req.query.q, "i") } : {};
  const post = await Post.find(q)
    .populate({
      path: "user", //因為Post.find，所以指向Post model裡頭的user欄位
      select: "name photo email sex",
    })
    .populate({
      path: "comments",
      select: "comment user",
    })
    .sort(timeSort);
  if (post.length !== 0) {
    return handleSuccess(res, post, `目前共有${post.length}則貼文`);
  } else return handleSuccess(res, "尚未有任何貼文");
};

//****post****
const postPosts = async (req, res, next) => {
  /**
    * #swagger.tags = ['Posts']
    * #swagger.description = 'create posts info'
    * #swagger.parameters['body']={
      in:"body",
      required : true,
      type:"object",
      description:"資料格式",
      schema:{
        "$user":"Object_id",
        "likes":10,
        "$content":"測試",
        "image":"string" ,
      }
      }

    *  #swagger.responses[200] = {
        description: "posts info",
        schema: {
            "status": true,
            "message": [
                {
                    "_id": "6662bc9c17654aceed98d988",
                    "user": {
                        "_id": "665d385fdc5fdb708aa120e7",
                        "name": "Mary",
                        "photo": "https://thumb.fakeface.rest/thumb_female_30_8ab46617938c195cadf80bc11a96ce906a47c110.jpg"
                    },
                    "likes": 0,
                    "content": "5",
                    "image": "",
                    "createdAt": "2024-06-07T07:54:04.995Z"
                }
            ]
        }
        }
        */

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
  await Post.findOneAndUpdate({ _id }, { $addToSet: { likes: req.user.id } });
  res.status(201).json({
    status: "success",
    postId: _id,
    userId: req.user.id,
  });
};

const deletelikepost = async (req, res, next) => {
  const _id = req.params.id;
  await Post.findOneAndUpdate({ _id }, { $pull: { likes: req.user.id } });
  res.status(201).json({
    status: "success",
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
    status: "success",
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
    status: "success",
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
