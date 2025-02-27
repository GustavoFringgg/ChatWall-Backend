const User = require("../model/users");

const getFollowingListService = async (user_id) => {
  return await User.findOne({ _id: user_id }).populate({
    path: "following.user",
    select: "name photo",
  });
};

module.exports = { getFollowingListService };
