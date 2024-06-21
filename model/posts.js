const mongoose = require("mongoose");
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual("comments", {
  ref: "Commentmodel", //comments collection
  foreignField: "post",
  localField: "_id",
});

const Post = mongoose.model("Postmodel", postSchema);
module.exports = Post;
