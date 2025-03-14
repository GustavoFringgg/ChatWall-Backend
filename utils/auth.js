const jwt = require("jsonwebtoken");
const appError = require("./appError");
const handleErrorAsync = require("./handleErrorAsync");
const handleSuccess = require("./handleSuccess");
const User = require("../model/users");
const isAuth = (fetchUser = true) => {
  return handleErrorAsync(async (req, res, next) => {
    // 確認 token 是否存在
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(appError(401, "你還沒有登入~~", next));
    }
    // 驗證 token 正確性
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) return next(appError(400, "token效期過期請重新登入"));
        else resolve(payload);
      });
    });
    if (fetchUser) {
      const currentUser = await User.findById(decoded.payload?.googleId ? decoded.payload.id : decoded.id).select("+email +createdAt");
      if (!currentUser) return next(appError(401, "用戶不存在"));
      //currentUser =>整包會員資料
      req.user = currentUser;
    } else {
      req.user = decoded;
    }
    next();
  });
};

const generateSendJWT = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  const decoded = jwt.decode(token);
  const issuedAt = new Date(decoded.iat * 1000).toLocaleString();
  const expiresAt = new Date(decoded.exp * 1000).toLocaleString();
  const createtime = decoded.iat;
  const expiretime = decoded.exp;
  const days = (expiretime - createtime) / (24 * 60 * 60);
  const data = {
    user: {
      token,
      name: user.name,
    },
    Issued_At: issuedAt,
    Expires_At: expiresAt,
    Expires_Day: days,
  };
  user.password = undefined;
  handleSuccess(res, "Token核發", data);
};

module.exports = {
  isAuth,
  generateSendJWT,
};
