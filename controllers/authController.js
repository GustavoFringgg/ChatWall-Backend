const User = require("../model/users");
const bcrypt = require("bcryptjs");
const validator = require("validator");
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

module.exports = { sign_in, sign_up };
