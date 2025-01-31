const User = require("../model/users");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const mongoose = require("mongoose");
const appError = require("../service/appError");
const { generateSendJWT } = require("../service/auth");
const sign_up = async (req, res, next) => {
  let { email, password, confirmPassword, name } = req.body;

  if (!validator.isLength(name, { min: 2, max: 7 })) {
    //回傳true | false
    return next(appError(422, "暱稱不能少於兩個字元，也不能多於七個字元", next));
  }

  if (!email || !password || !confirmPassword || !name) {
    // 內容不可為空
    return next(appError(402, "欄位未填寫正確！", next));
  }

  // 是否為 Email
  if (!validator.isEmail(email)) {
    return next(appError(422, "Email 格式不正確", next));
  }
  const user_email = await User.findOne({ email }); //true=>data false=>null

  if (user_email) {
    return next(appError(409, "信箱已註冊過~"));
  }

  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
    return next(appError(422, "密碼需包含至少一個字母和一個數字,並且至少6個字符長"));
  }
  // 密碼正確
  if (password !== confirmPassword) {
    return next(appError(422, "密碼不一致！", next));
  }

  // 密碼 8 碼以上
  if (!validator.isLength(password, { min: 8, max: 16 })) {
    return next(appError(422, "密碼需介於 6-18 字元之間", next));
  }

  //加密密碼;
  password = await bcrypt.hash(password, 12);
  const newUser = await User.create({
    email,
    password,
    name,
  });
  generateSendJWT(newUser, res);
}; //newUser會夾帶monogodb的_id物件

const sign_in = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(appError(402, "帳號密碼不可為空", next));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(appError(401, "帳號或密碼輸入錯誤", next));
  }

  if (user.googleId) {
    return next(appError(401, "此為google帳號，請改用google帳號登入", next));
  }

  const auth = await bcrypt.compare(password, user.password);

  if (!auth) {
    return next(appError(401, "帳號或密碼輸入錯誤", next));
  }
  generateSendJWT(user, res);
};

module.exports = { sign_in, sign_up };
