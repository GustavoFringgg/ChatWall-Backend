const Post = require("../model/posts"); //模組化Post 使用大寫
const User = require("../model/users"); //模組化User 使用大寫
const bcrypt = require("bcryptjs");
const validator = require("validator");
const handleSuccess = require("../service/handleSuccess");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const appError = require("../service/appError");
const { generateSendJWT } = require("../service/auth");
const firebaseAdmin = require("../service/firebase"); //使用firebase服務
const bucket = firebaseAdmin.storage().bucket(); //使用firestorage服務

const profile = async (req, res, next) => {
  const id = req.params.id;
  const userInfo = await User.findOne({ _id: id });
  // const { name, sex, email, createdAt } = req.user;
  // const localTime = createdAt.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
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
  let { name, sex, photo } = req.body;
  const updateuserinfo = await User.findByIdAndUpdate(req.user.id, { name, sex, photo }, { new: true, runValidators: true });
  if (!updateuserinfo) {
    return next(appError(404, "用戶不存在"));
  }
  return handleSuccess(res, `資料已被更新為${updateuserinfo.name}`, updateuserinfo);
};

const getLikeList = async (req, res, next) => {
  const likeList = await Post.find({
    likes: { $in: [req.user.payload?.googleId ? req.user.payload.id : req.user.id] },
  }).populate({
    path: "user",
    select: "name photo",
  });
  res.status(200).json({
    status: "sucess",
    likeList,
  });
};

const follow = async (req, res, next) => {
  {
    if (req.params.user_id === req.user.payload?.googleId ? req.user.payload.id : req.user.id) {
      return next(appError(401, "你無法追蹤自己", next));
    }

    if (!(await User.findOne({ _id: req.params.user_id }))) {
      return next(appError(401, "沒有此追蹤ID", next));
    }

    const data = await User.findOneAndUpdate(
      {
        _id: req.user.payload?.googleId ? req.user.payload.id : req.user.id,
        "following.user": { $ne: req.params.user_id },
      },
      {
        $addToSet: { following: { user: req.params.user_id } },
      }
    );
    await User.updateOne(
      {
        _id: req.params.user_id,
        "followers.user": { $ne: req.user.payload?.googleId ? req.user.payload.id : req.user.id },
      },
      {
        $addToSet: { followers: { user: req.user.payload?.googleId ? req.user.payload.id : req.user.id } },
      }
    );
    res.status(200).json({
      status: true,
      message: data.following,
    });
  }
};

const unfollow = async (req, res, next) => {
  if (req.params.id === req.user.payload?.googleId ? req.user.payload.id : req.user.id) {
    return next(appError(401, "您無法取消追蹤自己", next));
  }
  const currentUser = await User.findOneAndUpdate(
    {
      _id: req.user.payload?.googleId ? req.user.payload.id : req.user.id,
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
      $pull: { followers: { user: req.user.payload?.googleId ? req.user.payload.id : req.user.id } },
    }
  );
  const followingList = currentUser.following;
  res.status(200).json({
    status: true,
    followingList,
  });
};

const getFollowingList = async (req, res, next) => {
  const currentUser = await User.findOne({ _id: req.user.payload?.googleId ? req.user.payload.id : req.user.id }).populate({
    path: "following.user",
    select: "name photo",
  });
  const followingList = currentUser.following;
  res.status(200).json({
    status: true,
    followingList,
  });
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
  const payload = {
    id: req.user._id,
    googleId: req.user.googleId || null,
  };
  const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  const frontendCallbackUrl = `http://localhost:5173/#/callback?token=${token}`;
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
