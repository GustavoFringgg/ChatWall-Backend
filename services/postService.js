const User = require("../model/users");
const Post = require("../model/posts");
const getLikeListService = async (user_id) => {
  return await Post.find({
    likes: { $in: [user_id] },
  }).populate({
    path: "user",
    select: "name photo",
  });
};

module.exports = { getLikeListService };
