const express = require("express");
const router = express.Router();
const handleErrorAsync = require("../service/handleErrorAsync"); //處理全域的catch
const { isAuth } = require("../service/auth");
const userController = require("../controllers/userController");

router
  .post("/sign_up", [handleErrorAsync(userController.sign_up)]) //註冊會員
  .post("/sign_in", [handleErrorAsync(userController.sign_in)]) //登入會員
  .patch("/updatePassword", [isAuth, handleErrorAsync(userController.updatePassword)]) //重設密碼
  .get("/profile/", [isAuth, handleErrorAsync(userController.profile)]) //取得個人資料
  .patch("/profile/", [isAuth, handleErrorAsync(userController.patchprofile)]) //更新個人資料
  .get("/getLikeList", [isAuth, handleErrorAsync(userController.getLikeList)]) //取得個人案讚列表
  .post("/:user_id/follow", [isAuth, handleErrorAsync(userController.follow)]) //user id 追蹤朋友
  .get("/following", [isAuth, handleErrorAsync(userController.following)]) //取得個人追蹤名單
  .delete("/:id/unfollow", [isAuth, handleErrorAsync(userController.unfollow)]); //取消追蹤朋友

module.exports = router;
