const multer = require("multer");
const path = require("path");
const appError = require("../service/appError");
const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024, //處理前台檔案的資料(不超過2m)
  },

  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
      return cb(appError(400, "檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。"));
    } //確認檔案格式
    cb(null, true);
  },
}).any();

module.exports = upload; //處理圖片用
