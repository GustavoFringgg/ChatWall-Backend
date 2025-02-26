const express = require("express");
const router = express.Router();
const handleErrorAsync = require("../utils/handleErrorAsync");
const upload = require("../utils/image"); //上傳圖片控管
const { isAuth } = require("../utils/auth");

const firebaseAdmin = require("../utils/firebase"); //使用firebase服務
const bucket = firebaseAdmin.storage().bucket(); //使用firestorage服務
const uploadController = require("../controllers/uploadController");

router.post(
  "/file",
  [isAuth(false), upload, handleErrorAsync(uploadController.uploadfile)]
  /* #swagger.tags=['Upload-上傳照片']
　 #swagger.summary = '上傳個人照片/貼文照片 暫不開放API測試'
   #swagger.description='上傳個人照片/貼文照片 暫不開放API測試'
   #swagger.security = [{"apiKeyAuth": []}]
*/
); //上傳檔案
module.exports = router;
