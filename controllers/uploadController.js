const appError = require("../utils/appError");
const { v4: uuidv4 } = require("uuid");
const firebaseAdmin = require("../utils/firebase"); //使用firebase服務
const bucket = firebaseAdmin.storage().bucket(); //使用firestorage服務

const uploadfile = async (req, res, next) => {
  const { user, files } = req;

  //req.files=> [ {fieldname:"file" , originalanme:'0811.jpg'..buffer}]
  if (!files.length) {
    return next(appError(400, "尚未上傳檔案", next));
  }

  if (files.length > 1) {
    return next(appError(400, "請一次上傳一個檔案", next));
  }
  // 取得上傳的檔案資訊列表裡面的第一個檔案
  const file = files[0];

  // 基於檔案的原始名稱建立一個 blob 物件
  const folder = req.body.type === "user" ? "image_user" : "image_post";
  const blob = bucket.file(`${folder}/${uuidv4()}.${file.originalname.split(".").pop()}`);
  //images=>可以更換資料夾名稱，以利不同用途

  const blobStream = blob.createWriteStream();
  // 建立一個可以寫入 blob 的物件/管道

  // 監聽上傳狀態，當上傳完成時，會觸發 finish 事件
  blobStream.on("finish", () => {
    // 設定檔案的存取權限
    const config = {
      action: "read", // 權限
      expires: "12-31-2500", // 網址的有效期限
    };
    // 取得檔案的網址
    blob.getSignedUrl(config, (err, fileUrl) => {
      res.send({
        status: true,
        upload_fold: `${folder}`,
        fileUrl,
      });
    });
  });

  // 如果上傳過程中發生錯誤，會觸發 error 事件
  blobStream.on("error", (err) => {
    return next(appError(500, "上傳失敗", next));
  });

  // 將檔案的 buffer 寫入 blobStream
  blobStream.end(file.buffer);
};
module.exports = {
  uploadfile,
};
