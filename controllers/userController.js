const Post = require("../model/posts"); //模組化Post 使用大寫
const User = require("../model/users"); //模組化User 使用大寫
const bcrypt = require("bcryptjs");
const validator = require("validator");
const handleSuccess = require("../utils/handleSuccess");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const appError = require("../utils/appError");
const { generateSendJWT } = require("../utils/auth");
const firebaseAdmin = require("../utils/firebase"); //使用firebase服務
const bucket = firebaseAdmin.storage().bucket(); //使用firestorage服務

const { getLikeListService } = require("../services/postService");
const { getFollowingListService } = require("../services/userService");

const profile = async (req, res, next) => {
  const id = req.params.id;
  const userInfo = await User.findOne({ _id: id });
  if (!userInfo) {
    return next(appError(404, "找不到此會員", next));
  }
  handleSuccess(res, "取得個人資料", userInfo);
};

const updatePassword = async (req, res, next) => {
  let { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return next(appError(400, "密碼不一致！", next));
  }
  const userInfo = await User.findOne({ _id: req.user.id }).select("+password");
  if (!userInfo) {
    return next(appError(401, "查無此人", next));
  }
  const auth = await bcrypt.compare(oldPassword, userInfo.password);
  if (!auth) {
    return next(appError(401, "密碼輸入錯誤", next));
  }
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword)) {
    return next(appError(400, "密碼需包含至少一個字母和一個數字,並且至少8個字符長"));
  }
  newPassword = await bcrypt.hash(newPassword, 12);
  const user = await User.findByIdAndUpdate(req.user.id, {
    password: newPassword,
  });
  generateSendJWT(user, res);
};

const patchprofile = async (req, res, next) => {
  const user_id = req.user.payload?.googleId ? req.user.payload.id : req.user.id;
  let { name, sex, photo } = req.body;
  const updateuserinfo = await User.findByIdAndUpdate(user_id, { name, sex, photo }, { new: true, runValidators: true });
  if (!updateuserinfo) {
    return next(appError(404, "用戶不存在"));
  }
  return handleSuccess(res, `資料已被更新為${updateuserinfo.name}`, updateuserinfo);
};

const getLikeList = async (req, res, next) => {
  console.log("req.user", req.user);
  const user_id = req.user.payload?.id || req.user.id;
  const likeList = await getLikeListService(user_id);
  handleSuccess(res, "取得資料成功", likeList);
};

const follow = async (req, res, next) => {
  const targetUserId = req.user.payload?.googleId ? req.user.payload.id : req.user.id;
  if (req.params.user_id === targetUserId) {
    return next(appError(401, "你無法追蹤自己", next));
  }

  if (!(await User.findOne({ _id: req.params.user_id }))) {
    return next(appError(401, "沒有此追蹤ID", next));
  }

  const data = await User.findOneAndUpdate(
    {
      _id: targetUserId,
      "following.user": { $ne: req.params.user_id },
    },
    {
      $addToSet: { following: { user: req.params.user_id } },
    }
  );
  await User.updateOne(
    {
      _id: req.params.user_id,
      "followers.user": { $ne: targetUserId },
    },
    {
      $addToSet: { followers: { user: targetUserId } },
    }
  );
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

const getFollowingList = async (req, res, next) => {
  const user_id = req.user.payload?.googleId ? req.user.payload.id : req.user.id;
  const currentUser = await getFollowingListService(user_id);
  const followingList = currentUser.following;
  return handleSuccess(res, "取得追蹤清單成功", followingList);
};

const userimage = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(appError(400, "請提供圖片ID", next));
  }

  const folder = "image_user"; // 根據上傳時的資料夾名稱
  const filePath = `${folder}/${id}`;

  try {
    // 刪除圖片
    await bucket.file(filePath).delete();
    res.send({
      status: true,
      message: "圖片刪除成功",
    });
  } catch (err) {
    return next(appError(500, err.errors[0].reason, next));
  }
};

const tokencheck = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Token 驗證成功", user: req.user });
  } catch (error) {
    next(error);
  }
};

const googleapis = async (req, res, next) => {
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

module.exports = {
  profile,
  updatePassword,
  patchprofile,
  getLikeList,
  follow,
  unfollow,
  getFollowingList,
  userimage,
  tokencheck,
  googleapis,
};
