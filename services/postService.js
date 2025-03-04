const User = require("../model/users");
const Post = require("../model/posts");
const Comments = require("../model/comments");
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

//取消按讚
const deleteLikePostService = async (post_id, user_id) => {
  const updatedPost = await Post.findOneAndUpdate({ _id: post_id }, { $pull: { likes: user_id } }, { new: true });
  if (!updatedPost) throw appError(400, "沒有此貼文");
  return updatedPost;
};

//貼文
const postPostsService = async (content, image, user_id) => {
  return await Post.create({ user: user_id, content, image });
};

//更新貼文
const updatePostService = async (post_id, newcontent) => {
  const updatePostinfo = await Post.findByIdAndUpdate({ _id: post_id }, { content: newcontent }, { new: true, runValidators: true });
  if (!updatePostinfo) throw appError(400, "用戶不存在");
  return updatePostinfo;
};

//新增留言
const postcommentService = async (post_id, user_id, comment) => {
  if (!(await Post.findOne({ _id: post_id }))) throw appError(400, "沒有此貼文");
  return await Comments.create({ post: post_id, user: user_id, comment });
};
module.exports = { getLikeListService, likePostService, postPostsService, deleteLikePostService, updatePostService, postcommentService };
