const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      require: [true, "訊息錯誤"],
    },
    user: {
      //populate path指向的欄位
      type: mongoose.Schema.ObjectId,
      ref: "Usermodel", //指向user model的collection的名稱
      required: [true, "貼文姓名未填寫"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const Message = mongoose.model("Messagemodel", MessageSchema);
module.exports = Message;
