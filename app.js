//處理未捕捉的同步錯誤
process.on("uncaughtException", (e) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error("系統錯誤!"); //幾點幾分出錯的
  console.error(e); //出錯的程式碼在哪裡
  process.exit(1); //node process錯誤代號
});

const express = require("express");
const app = express();

const path = require("path");
const cookieParser = require("cookie-parser");

//logger
const logger = require("morgan");

//cors
const cors = require("cors");

//swagger
const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

//router限制
const rateLimit = require("express-rate-limit");

//Router
const messagesRouter = require("./routes/message");
const postsRouter = require("./routes/post");
const usersRouter = require("./routes/user");
const uploadRouter = require("./routes/upload");
const authRouter = require("./routes/auth");

//導入socket.io
require("./connections/index");
//導入passport
require("./connections/passport");

const anotherLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10分鐘
  max: 100, //請求100次
  message: "Too many requests, please try again later!",
});

app.use(cors());
app.use(logger("dev"));
app.use(express.json()); //解析req.body
app.use(express.urlencoded({ extended: false })); //解析req.body
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/api/messages", messagesRouter);

app.use("/upload", uploadRouter, anotherLimiter);
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerFile));

if (process.env.NODE_ENV != undefined) {
  console.log(process.env.NODE_ENV + "模式開啟");
} else {
  return console.log("模式開啟錯誤，請改用npm run start:dev 執行開發環境");
}

//router 404錯誤處理
app.use((req, res, next) => {
  res.status(404).send({
    status: false,
    message: "找不到網址",
  });
});

//正式環境錯誤function
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: false,
      statusCode: err.statusCode,
      message: err.message,
    });
  } else {
    console.error("出現重大錯誤", err);
    res.status(500).json({
      status: "error",
      message: "系統錯誤，請恰系統管理員",
    });
  }
};

// 開發環境錯誤function
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

//*接收從各處傳過來的 err 資訊 *
app.use((err, req, res, next) => {
  // dev
  err.statusCode = err.statusCode || 500; //有帶statusCode以statusCode宣告，否則以500進function
  if (process.env.NODE_ENV === "dev") {
    return resErrorDev(err, res);
  }
  // production(Node_env==dev直接進上一段if)
  if (err.name === "ValidationError") {
    //mongoose自訂錯誤
    err.message = "資料欄位未填寫正確，請重新輸入！";
    err.statusCode = 400;
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  return resErrorProd(err, res);
});

//處理未捕捉的非同步的錯誤
process.on("unhandledRejection", (reason, promise) => {
  console.error("未捕捉到的 rejection:", promise, "原因：", reason);
  process.exit(1);
});

/*在Node.js中，當一個promise被拒絕並且未被處理時，就會觸發"unhandledRejection"。
"unhandledRejection"監聽器通常放在最底端，原因如下：
1.確保所有promise操作都已被初始化並且可被此監聽器覆蓋
2.避免過早攔截，若將"unhandledRejection"放在最頂端，可能會導致誤判未處理
unhandledRejection: 用於處理未捕捉的 Promise 拒絕。當 Promise 被拒絕且沒有 catch 處理時會觸發。
uncaughtException: 用於處理未捕捉的同步異常。當 JavaScript 執行中出現未被 try/catch 捕捉的錯誤時會觸發。*/

module.exports = app;
