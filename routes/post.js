const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../model/posts");
const postController = require("../controllers/postController");

const { isAuth } = require("../service/auth");
const handleErrorAsync = require("../service/handleErrorAsync");

router
  .get(
    "/",
    [isAuth(false), handleErrorAsync(postController.getPosts)]
    /*** #swagger.tags=['Posts-貼文']
    #swagger.summary = '取得所有貼文'
    #swagger.description='取得所有貼文'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['keyword'] = {
      in: 'query',
      description: '查詢貼文官內容關鍵字',
      required: false,
      type: 'string'
    }
    #swagger.parameters['size'] = {
      in: 'query',
      description: '查詢貼文數量，上限 50 筆，預設 50 筆',
      required: false,
      type: 'integer',
      maximum: 50
    }
    #swagger.parameters['timeSort'] = {
      in: 'query',
      description: '發文時間排序方式，預設 desc 降冪排序，asc=最舊貼文，desc=最新貼文 hot=熱門貼文',
      required: false,
      type: 'string',
      enum: ['asc', 'desc','hot']
    }   
    #swagger.responses[201] =  {
    schema: { 
        "status": true,
        "message": [
            {
                "_id": "content_id",
                "user": {
                    "_id": "user_id",
                    "name": "user_name",
                    "photo": "user_photourl",
                    "sex": "user_sex",
                    "followers": [],
                    "following": []
                },
                "likes": [],
                "content": "user_content",
                "image": null,
                "createdAt": "2025-02-07T05:13:58.442Z",
                "comments": [],
                "id": "content_id"
            }
        ],
        "data": "目前共有1則貼文"
    }
};
     */
  )
  .get(
    "/:id",
    [isAuth(false), handleErrorAsync(postController.getonePost)]
    /**
     *#swagger.tags=['Posts-貼文']
      #swagger.summary = '取得單一貼文'
      #swagger.description='取得單一貼文 貼文ID 測試貼文ID:67a59696de2a2ff8736e3bfe'
      #swagger.security = [{"apiKeyAuth": []}]
      #swagger.responses[200] = {
      schema: { 
      "status": true,
      "message": [
      {
        "_id": "post_id",
        "user": {
          "_id": "user_id",
          "name": "_user_name",
          "photo": "user_photourl"
      },
        "likes": [],
        "content": "user_content",
        "image": null,
        "createdAt": "2025-02-07T05:13:58.442Z",
        "comments": [],
        "id": "post_id"
      }
      ]
      }
      }
      #swagger.responses[404] = {
      schema: { 
      "message": "無此 post ID",
      "error": {
      "statusCode": 404,
      "isOperational": true
      },
      "stack":"error.message"
      }
      }
      */
  )
  .post(
    "/",
    [isAuth(false), handleErrorAsync(postController.postPosts)]
    /** #swagger.tags=['Posts-貼文']
        #swagger.summary = '新增貼文'
        #swagger.description='新增貼文'
        #swagger.security = [{"apiKeyAuth": []}]
        #swagger.parameters['body'] = {
        in: 'body',
        description: '新增貼文資訊',
        required: true,
        schema: {
                $content: '今天想吃牛肉麵',
        }
        }
        #swagger.responses[201] = {
        schema: { 
        "status": true,
        "message": "新增貼文成功",
        "data": {
          "user": "user_id",
          "likes": [],
          "content": "今天想吃牛肉麵",
          "image": "",
          "_id": "content_id",
          "createdAt": "2025-02-07T05:28:43.709Z",
          "id": "content_id"
        }
        }
        }
        }
        #swagger.responses[400] = {
        schema: { 
        "message": "你沒有填寫 content 資料",
        "error": {
        "statusCode": 400,
        "isOperational": true
        },
        "stack": "error.message"
        }
        }
      */
  )
  .get(
    "/:id/user",
    [isAuth(false), handleErrorAsync(postController.getuserpost)]
    /*#swagger.tags=['Posts-貼文']
      #swagger.summary = '取得個人所有貼文列表'
      #swagger.description='取得個人所有貼文列表 user測試ID: 67a58d158898ee94cc357cbc'
      #swagger.security = [{"apiKeyAuth": []}]
      #swagger.responses[200] = {
      schema:{
      "status": true,
      "message": [
        {
          "_id": "貼文ID",
          "user": {
            "_id": "user_id",
            "name": "test",
            "email": "test@mail.com",
            "photo": "userurl",
            "sex": "male"
          },
          "likes": [],
          "content": "test123",
          "image": null,
          "createdAt": "2025-02-07T05:13:58.442Z",
          "comments": [],
          "id": "貼文ID"
        }
        ],
        "data": "目前共有1則貼文"
       }
  }
      */
  )
  .post(
    "/:id/comment",
    [isAuth(false), handleErrorAsync(postController.postcomment)]
    /* #swagger.tags=['Posts-貼文']
      #swagger.summary = '取新增一則貼文的留言'
      #swagger.description='新增一則貼文的留言 測試貼文ID:67a59696de2a2ff8736e3bfe'
      #swagger.security = [{"apiKeyAuth": []}]
      #swagger.parameters['body'] = {
        in: 'body',
        description: '新增留言',
        required: true,
        schema: {
                $comment: '測試留言',
        }
        }
      #swagger.responses[200] = {
        schema: { 
        "status": true,
        "message": "新增留言成功",
        "data": {
          "comments": {
            "comment": "測試留言",
            "user": "User_id",
            "post": "貼文_id",
            "_id": "留言_id",
            "createdAt": "2025-02-07T06:39:45.883Z"
          }
        }
        }
        }
        #swagger.responses[400] = {
        schema: { 
        "message": "留言區不能空白",
        "error": {
        "statusCode": 400,
        "isOperational": true
        },
        "stack": "error.message"
        }
        }
      */
  )
  .post(
    "/:id/likes",
    [isAuth(false), handleErrorAsync(postController.likepost)]
    /* #swagger.tags=['Posts-貼文']
      #swagger.summary = '新增一則貼文的讚'
      #swagger.description='新增一則貼文的讚 貼文測試id: 67a59696de2a2ff8736e3bfe'
      #swagger.security = [{"apiKeyAuth": []}]
      #swagger.responses[200] = {
      schema: { 
      "status": true,
      "message": "貼文按讚成功",
      "data": {
        "postId": "貼文id",
        "userId": "User_id"
              }
              }
      }
      }
      #swagger.responses[400] = {
        schema: { 
        "message": "沒有此貼文",
        "error": {
        "statusCode": 400,
        "isOperational": true
        },
        "stack": "error.message"
        }
        }
    */
  )
  .delete(
    "/:id/unlikes",
    [isAuth(false), handleErrorAsync(postController.deletelikepost)]
    /*#swagger.tags=['Posts-貼文']
      #swagger.summary = '取消一則貼文的讚'
      #swagger.description='取消一則貼文的讚 貼文測試id: 67a59696de2a2ff8736e3bfe'
      #swagger.security = [{"apiKeyAuth": []}] 
      #swagger.responses[200] = {
      schema: { 
      "status": true,
      "message": "取消貼文按讚成功",
      "data": {
        "postId": "貼文id",
        "userId": "User_id"
              }
              }
      }
      }
      #swagger.responses[400] = {
        schema: { 
        "message": "沒有此貼文",
        "error": {
        "statusCode": 400,
        "isOperational": true
        },
        "stack": "error.message"
        }
        }

    */
  )
  .delete(
    "/:id/post",
    [isAuth(false), handleErrorAsync(postController.deletePostWithComments)]
    /*
    #swagger.tags=['Posts-貼文']
    #swagger.summary = '刪除一則貼文'
    #swagger.description='刪除一則貼文(包含留言)，請輸入貼文ID，僅只能刪除自己帳號的貼文'
    #swagger.security = [{"apiKeyAuth": []}] 
    #swagger.responses[200] = {
      schema: { 
      "status": true,
      "message": "刪除文章成功",
      "data": {
        "_id": "貼文ID",
        "user": "使用者ID",
        "likes": [],
        "content": "貼文內容",
        "image": null,
        "createdAt": "2025-02-07T06:53:16.030Z",
        "id": "貼文ID"
      }
      }
      }
         #swagger.responses[400] = {
        schema: { 
        "message": "不可以刪除別人的貼文",
        "error": {
        "statusCode": 400,
        "isOperational": true
        },
        "stack": "error.message"
        }
        }
    
    */
  )
  .patch(
    "/:id",
    [isAuth(false), handleErrorAsync(postController.updatePost)] // #swagger.ignore = true
  );

module.exports = router;
