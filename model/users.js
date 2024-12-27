const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, //去除前後空格
      required: [true, "請輸入您的名字"],
    },
    email: {
      type: String,
      trim: true, //去除前後空格
      required: [true, "請輸入您的 Email"],
      unique: true, //唯一資料表，不允許重複
      lowercase: true, //將email自動轉為小寫
      select: false,
      // select為false代表建立這個屬性，但不會被find()找出來而具保護效果
      // select作用範圍僅限於Node.js後端的查詢，對於其他非Node.js環境或工具可能不具有效性
    },
    googleId: String,
    photo: {
      type: String,
      default: "https://firebasestorage.googleapis.com/v0/b/metawall-a2771.appspot.com/o/local%2Fuser_logo.jpg?alt=media&token=a1f0f697-3892-4ba4-8712-21c71ba7d7af",
    },
    sex: {
      type: String,
      enum: ["male", "female"],
      default: "male", //初始為男性
    },
    password: {
      type: String,
      minlength: 8, //最多為八碼
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    followers: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: "Usermodel" },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    following: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: "Usermodel" },
        createAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { versionKey: false }
);

userSchema.statics.findOrCreate = async function (doc) {
  let result = await this.findOne({ googleId: doc.googleId });
  console.log("usermodel-result", result);
  if (result) {
    return result;
  } else {
    console.log("usermodel-doc", doc);
    result = new this(doc);
    console.log("usermodel-newresult", result);
    return await result.save();
  }
};

const User = mongoose.model("Usermodel", userSchema);
module.exports = User;
