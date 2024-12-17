const jwt = require("jsonwebtoken");
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const handleSuccess = require("../service/handleSuccess");
const User = require("../model/users");
const isAuth = handleErrorAsync(async (req, res, next) => {
  // 確認 token 是否存在
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(appError(401, "你尚未登入！", next));
  }
  // 驗證 token 正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        return next(appError(400, "token效期過期請重新登入"));
      } else {
        resolve(payload);
      }
    });
  });
  //decoded : payload{ mongodb_id,iat(製造日期),exp(過期日期) }
  if (!decoded || !decoded.id) {
    return next(appError(401, "Token 無效"));
  }

  const currentUser = await User.findById(decoded.id).select("+email +createdAt");
  //currentUser =>整包會員資料

  if (!currentUser) {
    return next(appError(401, "用戶不存在"));
  }

  req.user = currentUser;
  next();
});
// 產生 JWT token
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
  // res.status(statusCode).json({
  //   status: "success",
  //   user: {
  //     token,
  //     name: user.name,
  //   },
  //   Issued_At: issuedAt,
  //   Expires_At: expiresAt,
  //   Expires_Day: days,
  // });
};

module.exports = {
  isAuth,
  generateSendJWT,
};
