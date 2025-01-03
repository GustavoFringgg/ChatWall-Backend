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
    [handleErrorAsync(postController.getPosts)]
    /*** #swagger.tags=['Posts-貼文']
     * #swagger.summary = '取得所有貼文'
     * #swagger.description='取得所有貼文'
     * #swagger.parameters['keyword'] = {
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
            description: '發文時間排序方式，預 設 desc 降冪排序，asc=遠到近，desc=近到遠',
            required: false,
            type: 'string',
            enum: ['asc', 'desc']
        }   
  
     */
  )
  .get(
    "/:id",
    [isAuth, handleErrorAsync(postController.getonePost)]
    /**
     * #swagger.tags=['Posts-貼文']
     * #swagger.summary = '取得單一貼文'
     * #swagger.description='取得單一貼文'*/
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
     * */
  )
  .get(
    "/user/:id",
    [isAuth, handleErrorAsync(postController.getuserpost)]
    /** #swagger.tags=['Posts-貼文']
     * #swagger.summary = '取得個人所有貼文列表'
     * #swagger.description='取得個人所有貼文列表'*/
  )
  .post(
    "/:id/comment",
    [isAuth(false), handleErrorAsync(postController.postcomment)]
    /** #swagger.tags=['Posts-貼文']
     * #swagger.summary = '取新增一則貼文的留言'
     * #swagger.description='新增一則貼文的留言'*/
  )
  .post(
    "/:id/likes",
    [isAuth, handleErrorAsync(postController.likepost)]
    /** #swagger.tags=['Posts-貼文']
     * #swagger.summary = '新增一則貼文的讚'
     * #swagger.description='新增一則貼文的讚'*/
  )
  .delete(
    "/:id/unlikes",
    [isAuth, handleErrorAsync(postController.deletelikepost)]
    /** #swagger.tags=['Posts-貼文']
     * #swagger.summary = '取消一則貼文的讚'
     * #swagger.description='取消一則貼文的讚'*/
  );

module.exports = router;
