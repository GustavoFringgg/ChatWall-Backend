const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_password);

mongoose
  .connect(DB)
  .then((res) => console.log("連線資料成功"))
  .catch((err) => console.log(err));
