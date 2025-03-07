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

//取得會員資料含密碼
const userInfoIncludePassword = async (user_id) => {
  const user_info = await User.findOne({ _id: user_id }).select("+password");
  if (!user_info) throw appError("找不到此會員");
  return user_info;
};

//更新會員密碼
const updatePasswordService = async (user_id, new_password) => {
  return await User.findByIdAndUpdate(user_id, { password: new_password });
};

//追蹤會員
const followUserService = async (user_id, target_user_id) => {
  const data = await User.findByIdAndUpdate(
    {
      _id: user_id,
      "following.user": { $ne: target_user_id },
    },
    {
      $addToSet: { following: { user: target_user_id } },
    }
  );
  await User.updateOne(
    {
      _id: target_user_id,
      "followers.user": { $ne: user_id },
    },
    {
      $addToSet: { followers: { user: user_id } },
    }
  );
  return data;
};
module.exports = { followUserService, updatePasswordService, userInfoIncludePassword, patchProfileService, getMemberProfileService, getFollowingListService };
