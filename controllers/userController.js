const Post = require("../model/posts"); //模組化Post 使用大寫
const User = require("../model/users"); //模組化User 使用大寫
const bcrypt = require("bcryptjs");
const validator = require("validator");
const handleSuccess = require("../service/handleSuccess");

const mongoose = require("mongoose");
const appError = require("../service/appError");
const { generateSendJWT } = require("../service/auth");

const sign_up = async (req, res, next) => {
  let { email, password, confirmPassword, name } = req.body;

  // 內容不可為空
  if (!email || !password || !confirmPassword || !name) {
    return next(appError("400", "欄位未填寫正確！", next));
  }

  // 密碼正確
  if (password !== confirmPassword) {
    return next(appError("400", "密碼不一致！", next));
  }

  // 密碼 8 碼以上
  if (!validator.isLength(password, { min: 8 })) {
    return next(appError("400", "密碼字數低於 8 碼", next));
  }

  // 是否為 Email
  if (!validator.isEmail(email)) {
    return next(appError("400", "Email 格式不正確", next));
  }

  // 加密密碼
  password = await bcrypt.hash(password, 12);
  const newUser = await User.create({
    email,
    password,
    name,
    sex: req.body.sex || "male",
  });

  generateSendJWT(newUser, 201, res);
};

const sign_in = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(appError(400, "帳號密碼不可為空", next));
  }
  const user = await User.findOne({ email }).select("+password");
  ///output objected or Null
  //findOne{{email}}為解構值，find key為email的value
  //select(" + ")這次回傳password
  if (user == null) {
    return next(appError(400, "帳號輸入錯誤", next));
  }

  const auth = await bcrypt.compare(password, user.password);
  //output Boolean
  //compare(req.password vs bcrypt.hash password)

  if (!auth) {
    return next(appError(400, "密碼輸入錯誤", next));
  }
  generateSendJWT(user, 200, res);
};

const profile = async (req, res, next) => {
  res.status(200).json({
    status: true,
    user: `這是${req.user.name}的個人頁面`,
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
  const updateuserinfo = await User.findByIdAndUpdate(
    req.user.id,
    { name, sex },
    { new: true, runValidators: true }
  );
  if (!updateuserinfo) {
    return next(appError(404, "用戶不存在"));
  }
  return handleSuccess(
    res,
    `${req.user.name}的資料已被更新為${updateuserinfo.name}`,
    updateuserinfo
  );
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

module.exports = {
  sign_up,
  sign_in,
  profile,
  updatePassword,
  patchprofile,
  getLikeList,
  follow,
  unfollow,
  following,
};
