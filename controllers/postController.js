//Model
const Post = require("../model/posts"); //模組化Post 使用大寫

//utils
const handleSuccess = require("../utils/handleSuccess");
const appError = require("../utils/appError");

//services
const { deletePostWithCommentsService, postcommentService, likePostService, postPostsService, deleteLikePostService, updatePostService } = require("../services/postService");

//functions
//取得貼文
const getPosts = async (req, res, next) => {
  const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt"; //createdAt由舊到新搜尋
  const keyword = req.query.keyword !== undefined ? { content: new RegExp(req.query.keyword, "i") } : {};
  //"i" = 匹配時會忽略大小寫差異
  let size = 50;
  if (req.query.size) {
    size = parseInt(req.query.size) > 50 ? 50 : parseInt(req.query.size);
  }
  let post = await Post.find(keyword)
    .populate({
      path: "user", //因為Post.find，所以指向Post model裡頭的user欄位
    })
    .populate({
      path: "comments",
      select: "comment user createdAt",
      options: { sort: { createdAt: -1 } }, // 確保comments是由新到舊排序
    })
    .populate({
      path: "likes",
      select: "name",
    })
    .sort(timeSort)
    .limit(size);
  if (req.query.timeSort === "hot") {
    post = post
      .map((post) => {
        const hotscores = (post.likes?.length || 0) * 2 + (post.comments?.length || 0);
        return { ...post.toObject(), hotscores };
      })
      .sort((a, b) => b.hotscores - a.hotscores);
  }
  if (post.length !== 0) {
    return handleSuccess(res, post, `目前共有${post.length}則貼文`);
  } else return handleSuccess(res, "尚未找到任何貼文", []);
};

const deletePostWithComments = async (req, res, next) => {
  const post_id = req.params.id;
  const user_id = req.user.payload?.id || req.user.id;
  const data = await deletePostWithCommentsService(post_id, user_id);
  handleSuccess(res, "刪除文章成功", data);
};

const getuserpost = async (req, res, next) => {
  const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt"; //createdAt由舊到新搜尋
  const keyword = req.query.keyword !== undefined ? { content: new RegExp(req.query.keyword, "i") } : {};
  const user = req.params.id;
  let post = await Post.find({ user, ...keyword })
    .populate({
      path: "user",
      select: "name photo email sex image",
    })
    .populate({
      path: "comments",
      select: "comment user createdAt",
      options: { sort: { createdAt: -1 } },
    })
    .populate({
      path: "likes",
      select: "name",
    })
    .sort(timeSort);
  if (req.query.timeSort === "hot") {
    post = post
      .map((post) => {
        const hotscores = (post.likes?.length || 0) * 2 + (post.comments?.length || 0);
        return { ...post.toObject(), hotscores };
      })
      .sort((a, b) => b.hotscores - a.hotscores);
  }
  if (post.length !== 0) {
    return handleSuccess(res, post, `目前共有${post.length}則貼文`);
  } else return handleSuccess(res, "尚未找到任何貼文", []);
};

const getonePost = async (req, res, next) => {
  const id = req.params.id;
  let post = await Post.findOne({ _id: id })
    .populate({
      path: "user",
      select: "name photo",
    })
    .populate({
      path: "comments",
      select: "comment createdAt",
      options: { sort: { createdAt: -1 } },
    })
    .populate({
      path: "likes",
      select: "name",
    });
  if (post) {
    return res.status(200).json({
      status: true,
      message: [post],
    });
  }
  return next(appError(404, "無此 post ID"));
};

//貼文API
const postPosts = async (req, res, next) => {
  const { content, image } = req.body;
  const user_id = req.user.payload?.id || req.user.id;
  const new_post = await postPostsService(content, image, user_id);
  handleSuccess(res, "新增貼文成功", new_post);
};

//按讚API
const likepost = async (req, res, next) => {
  const post_id = req.params.id;
  const user_id = req.user.payload?.id || req.user.id;
  const data = await likePostService(post_id, user_id);
  handleSuccess(res, "貼文按讚成功", data);
};

//取消按讚API
const deletelikepost = async (req, res, next) => {
  const post_id = req.params.id;
  const user_id = req.user.payload?.id || req.user.id;
  const updatedPost = await deleteLikePostService(post_id, user_id);
  handleSuccess(res, "取消貼文按讚成功", updatedPost);
};

//新增留言API
const postcomment = async (req, res, next) => {
  const post_id = req.params.id;
  const user_id = req.user.payload?.id || req.user.id;
  const { comment } = req.body;
  if (!comment) return next(appError(400, "留言區空白"));
  const newComment = await postcommentService(post_id, user_id, comment);
  handleSuccess(res, "新增留言成功", { comments: newComment });
};

//更新貼文API
const updatePost = async (req, res, next) => {
  const post_id = req.params.id;
  let { newContent } = req.body;
  const updatePostinfo = await updatePostService(post_id, newContent);
  handleSuccess(res, `資料已被更新完成`, updatePostinfo);
};

module.exports = {
  getPosts,
  postPosts,
  likepost,
  deletelikepost,
  getuserpost,
  postcomment,
  getonePost,
  deletePostWithComments,
  updatePost,
};
