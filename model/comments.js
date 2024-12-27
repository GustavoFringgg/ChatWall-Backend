const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "comment can not be empty!"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Usermodel",
      require: ["true", "user must belong to a post."],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Postmodel",
      require: ["true", "comment must belong to a post."],
    },
  },
  {
    versionKey: false,
  }
);
commentSchema.pre(/^find/, function (next) {
  //pre mongoose語法:前置器
  this.populate({
    //this=commentSchema的document
    path: "user",
    select: "name id createdAt photo", //將在comment底下的user欄位額外展開name欄位
  });

  next();
});
const Comment = mongoose.model("Commentmodel", commentSchema);

module.exports = Comment;
