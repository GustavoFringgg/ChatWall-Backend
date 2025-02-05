const swaggerAutogen = require("swagger-autogen")(); //引入swagger
const swaggerOptions = {
  autoHeaders: false, // 禁止自動添加 headers
};
const doc = {
  //會有info物件
  info: {
    title: "Meta API",
    description: "Meta swagger api",
  },
  host: "https://chatwall-backend.onrender.com",
  schemes: ["http", "https"],
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
