const User = require("../model/users");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const mongoose = require("mongoose");
const appError = require("../service/appError");
const { generateSendJWT } = require("../service/auth");
const sign_up = async (req, res, next) => {
  let { email, password, confirmPassword, name } = req.body;

  if (!validator.isLength(name, { min: 2 })) {
    //回傳true | false
    return next(appError("400", "暱稱不能少於兩個字元", next));
  }

  if (!email || !password || !confirmPassword || !name) {
    // 內容不可為空
    return next(appError("400", "欄位未填寫正確！", next));
  }

  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
    return next(appError(400, "密碼需包含至少一個字母和一個數字,並且至少6個字符長"));
  }
  // 密碼正確
  if (password !== confirmPassword) {
    return next(appError("400", "密碼不一致！", next));
  }

  // 密碼 8 碼以上
  if (!validator.isLength(password, { min: 8, max: 16 })) {
    return next(appError("400", "密碼需介於 6-18 字元之間", next));
  }

  // 是否為 Email
  if (!validator.isEmail(email)) {
    return next(appError("400", "Email 格式不正確", next));
  }
  const user_email = await User.findOne({ email }); //true=>data false=>null
  console.log(user_email);
  if (user_email) {
    return next(appError(400, "信箱已註冊過~"));
  }

  //加密密碼;
  password = await bcrypt.hash(password, 12);
  const newUser = req.body;
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
