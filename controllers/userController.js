const Post = require("../model/posts"); //模組化Post 使用大寫
const User = require("../model/users"); //模組化User 使用大寫
const bcrypt = require("bcryptjs");
const validator = require("validator");
const handleSuccess = require("../service/handleSuccess");

const mongoose = require("mongoose");
const appError = require("../service/appError");
const { generateSendJWT } = require("../service/auth");
const firebaseAdmin = require("../service/firebase"); //使用firebase服務
const bucket = firebaseAdmin.storage().bucket(); //使用firestorage服務
const profile = async (req, res, next) => {
  const { name, sex, email, createdAt } = req.user;
  const localTime = createdAt.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
  res.status(200).json({
    status: true,
    user: `這是${name}的個人頁面`,
    email: email,
    sex: sex,
    message: `帳號建立時間:${localTime}`,
  });
};

const updatePassword = async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(appError(400, "密碼不一致！", next));
  }
  //正規表達式
  //1.^(?=.*[A-Za-z]) 確保密碼中至少包含一個字母。
  //2.(?=.*\d) 確保密碼中至少包含一個數字。
  //3.[A-Za-z\d]{8,}$ 確保密碼長度至少為8個字符。
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
    return next(appError(400, "密碼需包含至少一個字母和一個數字,並且至少8個字符長"));
  }

  //開始加密
  const newPassword = await bcrypt.hash(password, 12);
  //取出資料庫ID比對
  const user = await User.findByIdAndUpdate(req.user.id, {
    password: newPassword,
  });
  generateSendJWT(user, 200, res);
};

const patchprofile = async (req, res, next) => {
  const { name, sex } = req.body;
  const updateuserinfo = await User.findByIdAndUpdate(req.user.id, { name, sex }, { new: true, runValidators: true });
  if (!updateuserinfo) {
    return next(appError(404, "用戶不存在"));
  }
  return handleSuccess(res, `${req.user.name}的資料已被更新為${updateuserinfo.name}`, updateuserinfo);
};

const getLikeList = async (req, res, next) => {
  const likeList = await Post.find({
    likes: { $in: [req.user.id] },
  }).populate({
    path: "user",
    select: "name_id",
  });
  res.status(200).json({
    status: "sucess",
    likeList,
  });
};

const follow = async (req, res, next) => {
  {
    if (req.params.user_id === req.user.id) {
      return next(appError(401, "你無法追蹤自己", next));
    }

    if (!(await User.findOne({ _id: req.params.user_id }))) {
      return next(appError(401, "沒有此追蹤ID", next));
    }

    await User.updateOne(
      {
        _id: req.user.id,
        "following.user": { $ne: req.params.user_id },
      },
      {
        $addToSet: { following: { user: req.params.user_id } },
      }
    );
    await User.updateOne(
      {
        _id: req.params.user_id,
        "followers.user": { $ne: req.user.id },
      },
      {
        $addToSet: { followers: { user: req.user.id } },
      }
    );
    res.status(200).json({
      status: true,
      message: "您已成功追蹤！",
    });
  }
};

const unfollow = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    return next(appError(401, "您無法取消追蹤自己", next));
  }
  await User.updateOne(
    {
      _id: req.user.id,
    },
    {
      $pull: { following: { user: req.params.id } },
    }
  );
  await User.updateOne(
    {
      _id: req.params.id,
    },
    {
      $pull: { followers: { user: req.user.id } },
    }
  );
  res.status(200).json({
    status: true,
    message: "您已成功取消追蹤！",
  });
};

const following = async (req, res, next) => {
  const currentUser = await User.findOne({ _id: req.user.id }).populate({
    path: "following.user",
    select: "name",
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

const tokencheck = (req, res, next) => {
  res.status(200).json({ message: "Token 驗證成功", user: req.user });
};

module.exports = {
  profile,
  updatePassword,
  patchprofile,
  getLikeList,
  follow,
  unfollow,
  following,
  userimage,
  tokencheck,
};
