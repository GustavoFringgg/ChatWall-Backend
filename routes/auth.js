const express = require("express");
const router = express.Router();
const handleErrorAsync = require("../service/handleErrorAsync");
const authController = require("../controllers/authController");

router.post(
  "/sign_Up",
  [handleErrorAsync(authController.sign_up)]
  /*** #swagger.tags=['Auth']*
   * #swagger.summary = '註冊'
   * #swagger.description='註冊'*/
);

router.post(
  "/sign_In",
  [handleErrorAsync(authController.sign_in)]
  /*** #swagger.tags=['Auth']
   * #swagger.summary = '登入'
   * #swagger.description='登入'*/
);

module.exports = router;
