const swaggerOptions = {
  autoHeaders: false, // 禁止自動添加 headers
};
const swaggerAutogen = require("swagger-autogen")(swaggerOptions); //引入swagger
let baseURL;
if (process.env.NODE_ENV === "production") {
  baseURL = "chatwall-backend.onrender.com";
} else {
  baseURL = "localhost:3000";
}
const doc = {
  //會有info物件
  info: {
    title: "ChatWall 後端API",
    description: "ChatWall swagger api",
  },
  host: baseURL,
  schemes: process.env.NODE_ENV === "production" ? ["https"] : ["http"],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "headers",
      name: "authorization",
      description: '請在取得的 token 前補上 "Bearer " 再送出(須包含一空白字元)，範例："Bearer {your token}"',
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointFile = ["./app.js"];

swaggerAutogen(outputFile, endpointFile, doc);
