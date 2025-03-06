//Model
const User = require("../model/users");

//third-party
const bcrypt = require("bcryptjs");
const validator = require("validator");

//utils
const appError = require("../utils/appError");
const { generateSendJWT } = require("../utils/auth");

//functions
const sign_up = async (req, res, next) => {
  let { email, password, confirmPassword, name } = req.body;

  if (!validator.isLength(name, { min: 2, max: 7 })) {
    return next(appError(422, "暱稱不能少於兩個字元，也不能多於七個字元", next));
  }

  if (!email || !password || !confirmPassword || !name) {
    return next(appError(402, "欄位未填寫正確！", next));
  }

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

  if (password !== confirmPassword) {
    return next(appError(422, "密碼不一致！", next));
  }

  if (!validator.isLength(password, { min: 8, max: 16 })) {
    return next(appError(422, "密碼需介於 6-18 字元之間", next));
  }

  password = await bcrypt.hash(password, 12);
  const newUser = await User.create({
    email,
    password,
    name,
  });
  generateSendJWT(newUser, res);
};

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

const tokencheck = async (req, res, next) => {
  res.status(200).json({ message: "Token 驗證成功", user: req.user });
};
module.exports = { sign_in, sign_up, tokencheck };
