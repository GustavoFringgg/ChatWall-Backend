const express = require("express");
const router = express.Router();
const handleErrorAsync = require("../service/handleErrorAsync");
const upload = require("../service/image"); //上傳圖片控管
const { isAuth } = require("../service/auth");

const firebaseAdmin = require("../service/firebase"); //使用firebase服務
const bucket = firebaseAdmin.storage().bucket(); //使用firestorage服務
const uploadController = require("../controllers/uploadController");

router.post("/filecheck", [isAuth, upload, handleErrorAsync(uploadController.uploadcheck)] /*** #swagger.tags=['Upload']*/); //檔案確認
router.post("/file", [isAuth, upload, handleErrorAsync(uploadController.uploadfile)] /*** #swagger.tags=['Upload']*/); //上傳檔案
module.exports = router;
