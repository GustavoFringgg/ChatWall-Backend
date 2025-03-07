//Model
const Post = require("../model/posts");
const User = require("../model/users");

//third-party
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

//utils
const handleSuccess = require("../utils/handleSuccess");
const appError = require("../utils/appError");
const { generateSendJWT } = require("../utils/auth");
const { getLikeListService } = require("../services/postService");
const { followUserService, updatePasswordService, userInfoIncludePassword, patchProfileService, getFollowingListService, getMemberProfileService } = require("../services/userService");

//取得會員資料API
const profile = async (req, res) => {
  const user_id = req.params.id;
  const user_info = await getMemberProfileService(user_id);
  handleSuccess(res, "取得個人資料", user_info);
};

//更新會員密碼API
const updatePassword = async (req, res, next) => {
  let { oldPassword, newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) return next(appError(400, "密碼不一致！", next));
  const user_id = req.user.id;
  const user_info = await userInfoIncludePassword(user_id);
  const is_auth = await bcrypt.compare(oldPassword, user_info.password);
  if (!is_auth) return next(appError(401, "密碼輸入錯誤"));
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword)) return next(appError(400, "密碼需包含至少一個字母和一個數字,並且至少8個字符長"));
  newPassword = await bcrypt.hash(newPassword, 12);
  const user = await updatePasswordService(user_id, newPassword);
  generateSendJWT(user, res);
};

//追蹤會員API
const follow = async (req, res, next) => {
  const user_id = req.user.payload?.id || req.user.id;
  const target_user_id = req.params.user_id;
  if (target_user_id === user_id) return next(appError(401, "你無法追蹤自己", next));
  const data = await followUserService(user_id, target_user_id);
  return handleSuccess(res, "追蹤成功", data);
};

const unfollow = async (req, res, next) => {
  const targetUserId = req.user.payload?.googleId ? req.user.payload.id : req.user.id;
  if (req.params.id === targetUserId) {
    return next(appError(401, "您無法取消追蹤自己", next));
  }
  const currentUser = await User.findOneAndUpdate(
    {
      _id: targetUserId,
    },
    {
      $pull: { following: { user: req.params.id } },
    },
    {
      new: true,
    }
  ).populate({
    path: "following.user",
    select: "name photo",
  });
  await User.updateOne(
    {
      _id: req.params.id,
    },
    {
      $pull: { followers: { user: targetUserId } },
    }
  );
  const followingList = currentUser.following;
  return handleSuccess(res, "取消追蹤成功", followingList);
};

//更新會員資料API
const patchprofile = async (req, res) => {
  const user_id = req.user.payload?.id || req.user.id;
  let { name, sex, photo } = req.body;
  const updateuserinfo = await patchProfileService(user_id, name, sex, photo);
  handleSuccess(res, `資料已被更新為${updateuserinfo.name}`, updateuserinfo);
};

//取得追蹤清單API
const getFollowingList = async (req, res) => {
  const user_id = req.user.payload?.googleId ? req.user.payload.id : req.user.id;
  const currentUser = await getFollowingListService(user_id);
  const followingList = currentUser.following;
  handleSuccess(res, "取得追蹤清單成功", followingList);
};

//取的按讚清單API(from post model)
const getLikeList = async (req, res) => {
  const user_id = req.user.payload?.id || req.user.id;
  const likeList = await getLikeListService(user_id);
  handleSuccess(res, "取得資料成功", likeList);
};

//google登入API
const googleapis = async (req, res) => {
  let frontendCallbackUrl;
  const payload = {
    id: req.user._id,
    googleId: req.user.googleId || null,
  };
  const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  if (process.env.NODE_ENV === "production") {
    frontendCallbackUrl = `https://chat-wall-frontend-v2.vercel.app/#/callback?token=${token}`;
  } else {
    frontendCallbackUrl = `http://localhost:5173/#/callback?token=${token}`;
  }
  res.redirect(frontendCallbackUrl);
};

// const userimage = async (req, res, next) => {
//   const { id } = req.params;
//   if (!id) {
//     return next(appError(400, "請提供圖片ID", next));
//   }
//   const folder = "image_user"; // 根據上傳時的資料夾名稱
//   const filePath = `${folder}/${id}`;
//   try {
// 刪除圖片
//     await bucket.file(filePath).delete();
//     res.send({
//       status: true,
//       message: "圖片刪除成功",
//     });
//   } catch (err) {
//     return next(appError(500, err.errors[0].reason, next));
//   }
// };

module.exports = {
  profile,
  updatePassword,
  patchprofile,
  getLikeList,
  follow,
  unfollow,
  getFollowingList,
  googleapis,
};
