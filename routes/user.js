const express = require("express");
const router = express.Router();
const handleErrorAsync = require("../service/handleErrorAsync"); //處理全域的catch
const { isAuth } = require("../service/auth");
const userController = require("../controllers/userController");

router
  .post("/sign_up", [handleErrorAsync(userController.sign_up)] /*** #swagger.tags=['Users']*/) //註冊會員
  .post("/sign_in", [handleErrorAsync(userController.sign_in)] /*** #swagger.tags=['Users']*/) //登入會員
  .patch("/updatePassword", [isAuth, handleErrorAsync(userController.updatePassword)] /*** #swagger.tags=['Users']*/) //重設密碼
  .get("/profile/", [isAuth, handleErrorAsync(userController.profile)] /*** #swagger.tags=['Users']*/) //取得個人資料
  .patch("/profile/", [isAuth, handleErrorAsync(userController.patchprofile)] /*** #swagger.tags=['Users']*/) //更新個人資料
  .get("/getLikeList", [isAuth, handleErrorAsync(userController.getLikeList)] /*** #swagger.tags=['Users']*/) //取得個人案讚列表
  .post("/:user_id/follow", [isAuth, handleErrorAsync(userController.follow)] /*** #swagger.tags=['Users']*/) //user id 追蹤朋友
  .get("/following", [isAuth, handleErrorAsync(userController.following)] /*** #swagger.tags=['Users']*/) //取得個人追蹤名單
  .delete("/:id/unfollow", [isAuth, handleErrorAsync(userController.unfollow)] /*** #swagger.tags=['Users']*/); //取消追蹤朋友

module.exports = router;
