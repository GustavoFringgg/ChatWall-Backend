const multer = require("multer");
const path = require("path");
const appError = require("./appError");
const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024, //處理前台檔案的資料(不超過2m)
  },

  fileFilter(req, file, next) {
    /*file=>multer 將前台資訊轉換成物件
      {
        fieldname: 'file',
        originalname: 'samsung-memory-IJolVhJKk7c-unsplash.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg'
      }
    */
    const ext = path.extname(file.originalname).toLowerCase();
    //ext> .pdf .jpg
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
      return next(appError(400, "檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。"));
    } //確認檔案格式
    next(null, true);
  },
}).any(); //增加req.files

module.exports = upload; //處理圖片用
