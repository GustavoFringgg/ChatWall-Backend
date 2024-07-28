const express = require("express");
const router = express.Router();
const handleErrorAsync = require("../service/handleErrorAsync");
const authController = require("../controllers/authController");

router.post("/sign_Up", [handleErrorAsync(authController.sign_up)]);
router.post("/sign_In", [handleErrorAsync(authController.sign_in)]);

// .post("/sign_up", [handleErrorAsync(userController.sign_up)] /*** #swagger.tags=['Users-會員']*/) //註冊會員
// .post("/sign_in", [handleErrorAsync(userController.sign_in)] /*** #swagger.tags=['Users-會員']*/) //登入會員

module.exports = router;
