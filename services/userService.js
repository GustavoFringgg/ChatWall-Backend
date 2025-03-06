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
const getMemberProfileService = async (user_id) => {
  const user_info = await User.findOne({ _id: user_id });
  if (!user_info) throw appError(400, "找不到此會員");
  return user_info;
};

//更新會員資料
const patchProfileService = async (user_id, name, sex, photo) => {
  const update_user_info = await User.findByIdAndUpdate(user_id, { name, sex, photo }, { new: true, runValidators: true });
  if (!update_user_info) throw appError(400, "找不到此會員");
  return update_user_info;
};

module.exports = { patchProfileService, getMemberProfileService, getFollowingListService };
