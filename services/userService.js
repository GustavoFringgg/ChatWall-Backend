const User = require("../model/users");
const appError = require("../utils/appError");

//取得追蹤清單
const getFollowingListService = async (user_id) => {
  return await User.findOne({ _id: user_id }).populate({
    path: "following.user",
    select: "name photo",
  });
};

//取得會員資料
const getMemberProfileServeice = async (user_id) => {
  const user_info = await User.findOne({ _id: user_id });
  if (!user_info) throw appError(400, "找不到此會員");
  return user_info;
};

module.exports = { getMemberProfileServeice, getFollowingListService };
