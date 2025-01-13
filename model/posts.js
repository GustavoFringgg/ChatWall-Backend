const mongoose = require("mongoose");
const Comment = require("./comments");
const postSchema = new mongoose.Schema(
  {
    user: {
      //populate path指向的欄位
      type: mongoose.Schema.ObjectId,
      ref: "Usermodel", //指向user model的collection的名稱
      required: [true, "貼文姓名未填寫"],
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Usermodel",
      },
    ],
    content: {
      type: String,
      required: [true, "Content 未填寫"],
    },
    image: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    //如virtual欄位需加此兩行，讓model掛上去虛擬欄位
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual("comments", {
  //使用populate才會顯示，virtual跟popolate缺一不可
  ref: "Commentmodel", //comments collection
  foreignField: "post",
  localField: "_id", //post id 抓取commentmodel的post欄位id
});

postSchema.pre(/^findOneAndDelete/, async function (next) {
  // const query = this; // `this` 是查詢物件
  const query = this.getQuery(); // `this` 是查詢物件
  const commentreturn = await Comment.deleteMany({ post: query._id });
  console.log("commentreturn", commentreturn);
  next();
});
const Post = mongoose.model("Postmodel", postSchema);
module.exports = Post;
