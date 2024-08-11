//出現重大錯誤時，沒有被try cash捕捉，就會觸發uncaughtException並捕捉
////監聽器通常放在最頂端，確保應用程式在啟動時就能捕捉到任何可能的異常*
process.on("uncaughtException", (e) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error("系統錯誤!"); //幾點幾分出錯的
  console.error(e); //出錯的程式碼在哪裡
  process.exit(1); //node process錯誤代號
});

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const swaggerUI = require("swagger-ui-express"); //swaggerui設定
const swaggerFile = require("./swagger-output.json");
const axios = require("axios");
const rateLimit = require("express-rate-limit");

//router引入
const postsRouter = require("./routes/post");
const usersRouter = require("./routes/user");
const uploadRouter = require("./routes/upload");
const authRouter = require("./routes/auth");
const { log } = require("console"); //將console.log更改為log，更簡潔易讀
//mongodb引入
require("./connections");
const anotherLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10分鐘
  max: 100, //請求100次
  message: "Too many requests, please try again later!",
});
app.use(anotherLimiter);
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/upload", uploadRouter, anotherLimiter);

app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerFile));
if (process.env.NODE_ENV != undefined) {
  log(process.env.NODE_ENV + "模式開啟");
} else {
  log("模式開啟錯誤，請改用npm run start:dev 執行開發環境");
}

//404錯誤處理 當上述router都沒有執行，就會跑404 wrong router
app.use((req, res, next) => {
  res.status(404).send({
    status: false,
    message: "找不到網址",
  });
});

// express 錯誤處理
//正式環境錯誤function
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: false,
      message: err.message,
    });
  } else {
    // log 紀錄
    console.error("出現重大錯誤", err);
    // 送出罐頭預設訊息
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
    stack: err.stack, //在dev模式下，會顯示err.stack堆疊錯誤訊息
  });
};

//*****負責接收從各處傳過來的 err 資訊 aka垃圾集中場*****
app.use((err, req, res, next) => {
  // dev
  err.statusCode = err.statusCode || 500; //有帶statusCode以statusCode宣告，否則以500進function

  if (process.env.NODE_ENV === "dev") {
    return resErrorDev(err, res);
  }
  // production(Node_env==dev直接進上一段if)
  if (err.name === "ValidationError") {
    err.message = "資料欄位未填寫正確，請重新輸入！";
    err.statusCode = 400;
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  return resErrorProd(err, res);
});

// 透過process.on註冊監聽，處理未捕捉的promise
process.on("unhandledRejection", (reason, promise) => {
  console.error("未捕捉到的 rejection:", promise, "原因：", reason);
  process.exit(1);
});

/*在Express應用程式中使用process.on()方法設置事件監聽器，
進行監聽和處理各種事件，例如處理未捕獲的異常、處理程式即將退出等情況*/

/*在Node.js中，當一個promise被拒絕並且未被處理時，就會觸發"unhandledRejection"。
"unhandledRejection"監聽器通常放在最底端，原因如下：
1.確保所有promise操作都已被初始化並且可被此監聽器覆蓋
2.避免過早攔截，若將"unhandledRejection"放在最頂端，可能會導致誤判未處理*/

// unhandledRejection: 用於處理未捕捉的 Promise 拒絕。當 Promise 被拒絕且沒有 catch 處理時會觸發。
// uncaughtException: 用於處理未捕捉的同步異常。當 JavaScript 執行中出現未被 try/catch 捕捉的錯誤時會觸發。

module.exports = app;
