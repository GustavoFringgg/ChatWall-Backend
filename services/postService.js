const User = require("../model/users");
const Post = require("../model/posts");
const appError = require("../utils/appError");

//取得按讚清單
const getLikeListService = async (user_id) => {
  return await Post.find({
    likes: { $in: [user_id] },
  }).populate({
    path: "user",
    select: "name photo",
  });
};

//按讚
const likePostService = async (post_id, user_id) => {
  const updatedPost = await Post.findOneAndUpdate({ _id: post_id }, { $addToSet: { likes: user_id } }, { new: true });
  if (!updatedPost) throw appError(400, "沒有此貼文");
  return updatedPost;
};
module.exports = { getLikeListService, likePostService };
