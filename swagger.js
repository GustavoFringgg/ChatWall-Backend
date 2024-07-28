const swaggerAutogen = require("swagger-autogen")(); //引入swagger

const doc = {
  //會有info物件
  info: {
    title: "Meta API",
    description: "Meta swagger api",
  },
  host: "localhost:3000",
  schemes: ["http", "https"],
  securityDefinitions: {
    apikeyAuth: {
      type: "apiKey",
      in: "headers",
      name: "authorization",
      description: "請加上api key",
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointFile = ["./app.js"];

swaggerAutogen(outputFile, endpointFile, doc);
