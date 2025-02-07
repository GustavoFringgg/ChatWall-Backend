const express = require("express");
const messagesController = require("../controllers/messageControllers");
const { isAuth } = require("../service/auth");
const handleErrorAsync = require("../service/handleErrorAsync"); //處理全域的catch
const router = express.Router();

// router.get("/", messagesController.getMessages);
router.get(
  "/",
  [isAuth(false), handleErrorAsync(messagesController.getMessages)]
  /**
    #swagger.tags=['Messages-聊天室']
    #swagger.summary = '取得聊天室內容'
    #swagger.description='取得最新20筆聊天室內容'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.responses[201] = {
    schema: { 
    "_id": "67934f7d2fd34c3781c34184",
    "content": "大家可以互相追蹤按讚喔",
    "user": {
    "_id": "User_id",
    "name": "User_name",
    "photo": "User_photoUrl"
    },
    "createdAt": "2025-01-24T08:29:41.341Z"
    }
    }
    */
);
module.exports = router;
