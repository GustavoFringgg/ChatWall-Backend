const User = require("../model/users");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const mongoose = require("mongoose");
const appError = require("../service/appError");
const jwt = require("jsonwebtoken");
const { generateSendJWT } = require("../service/auth");
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

const validate = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(appError(401, "你還沒有登入~~", next));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 驗證 JWT
    return res.json({ user: decoded, message: "Token 驗證成功" });
    // const decoded = await new Promise((resolve, reject) => {
    //   jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    //     if (err) {
    //       return next(appError(400, "token效期過期請重新登入"));
    //     } else {
    //       resolve(payload);
    //     }
    //   });
    // });
  } catch (error) {
    return res.status(401).json({ message: "無效的 Token" });
  }
};
module.exports = { sign_in, sign_up, validate };
