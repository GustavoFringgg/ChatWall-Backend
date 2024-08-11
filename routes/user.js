const express = require("express");
const router = express.Router();
const handleErrorAsync = require("../service/handleErrorAsync"); //處理全域的catch
const { isAuth } = require("../service/auth");
const userController = require("../controllers/userController");

router
  .patch("/updatePassword", [isAuth, handleErrorAsync(userController.updatePassword)] /*** #swagger.tags=['Users-會員']*/) //重設密碼
  .get("/profile/", [isAuth, handleErrorAsync(userController.profile)] /*** #swagger.tags=['Users-會員']*/) //取得個人資料
  .patch("/profile/", [isAuth, handleErrorAsync(userController.patchprofile)] /*** #swagger.tags=['Users-會員']*/) //更新個人資料
  .get("/getLikeList", [isAuth, handleErrorAsync(userController.getLikeList)] /*** #swagger.tags=['Users-會員']*/) //取得個人案讚列表
  .post("/:user_id/follow", [isAuth, handleErrorAsync(userController.follow)] /*** #swagger.tags=['Users-會員']*/) //user id 追蹤朋友
  .get("/following", [isAuth, handleErrorAsync(userController.following)] /*** #swagger.tags=['Users-會員']*/) //取得個人追蹤名單
  .delete("/:id/unfollow", [isAuth, handleErrorAsync(userController.unfollow)] /*** #swagger.tags=['Users-會員']*/) //取消追蹤朋友
  .delete("/userimage/:id", [isAuth, handleErrorAsync(userController.userimage)]);
module.exports = router;
