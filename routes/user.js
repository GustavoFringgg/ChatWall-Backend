const express = require("express");
const router = express.Router();
const handleErrorAsync = require("../service/handleErrorAsync"); //處理全域的catch
const { isAuth } = require("../service/auth");
const userController = require("../controllers/userController");
const passport = require("passport");
const User = require("../model/users");

router
  .patch(
    "/updatePassword",
    [isAuth(false), handleErrorAsync(userController.updatePassword)]
    /* #swagger.tags=['Users-會員']
     #swagger.summary = '重設密碼'
     #swagger.description='重設密碼'
     #swagger.security = [{"apiKeyAuth": []}]
     #swagger.parameters['body'] = {
        in: 'body',
        description: '輸入原密碼，新密碼，確認密碼',
        required: true,
        schema: {
                $oldPassword: '123456789A',
                $newPassword: '123456789B',
                $confirmPassword: '123456789B',
        }
        }
        #swagger.responses[200] = {
        schema: { 
        "status": true,
        "message": "Token核發",
        "data": {
        "user": {
        "token": "token",
        "name": "test"
        },
        "Issued_At": "2025/2/7 下午4:05:03",
        "Expires_At": "2025/2/9 下午4:05:03",
        "Expires_Day": 2
        }
        }
        }
        #swagger.responses[401] = {
        schema: { 
        "message": "密碼輸入錯誤",
        "error": {
        "statusCode": 401,
        "isOperational": true
        },
        "stack": "error.message"
        }
        }
        #swagger.responses[400] = {
        schema: { 
        "message": "密碼不一致",
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
    "/profile/:id",
    [isAuth(false), handleErrorAsync(userController.profile)]
    /* #swagger.tags=['Users-會員']
     #swagger.summary = '取得會員資料'
     #swagger.description='取得會員資料 user測試ID: 67a58d158898ee94cc357cbc'
     #swagger.security = [{"apiKeyAuth": []}]
     #swagger.responses[200] = {
        schema: { 
        "status": true,
        "message": "取得個人資料",
        "data": {
          "_id": "user_id",
          "name": "user_name",
          "photo": "user_photourl",
          "sex": "user_sex",
          "followers": [],
          "following": []
        }
        }
        }
        #swagger.responses[404] = {
        schema: { 
        "message": "找不到此會員",
        "error": {
        "statusCode": 404,
        "isOperational": true
        },
        "stack": "error.message"
        }
        }
 
  */
  )
  .patch(
    "/profile/",
    [isAuth(false), handleErrorAsync(userController.patchprofile)]
    /*
    #swagger.tags=['Users-會員']
    #swagger.summary = '更新會員資料'
    #swagger.security = [{"apiKeyAuth": []}]
  */
  )
  .get(
    "/getLikeList",
    [isAuth(false), handleErrorAsync(userController.getLikeList)]
    /*
    #swagger.tags=['Users-會員']
    #swagger.summary = '取得個人按讚列表'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.responses[200] = {
    schema: { 
    "status": true,
    "likeList": []
    }
    }
  */
  )
  .post(
    "/:user_id/follow",
    [isAuth(false), handleErrorAsync(userController.follow)]
    /*  
    #swagger.tags=['Users-會員']
    #swagger.summary = '追蹤其他人'
    #swagger.description='user測試ID: 679349592fd34c3781c33cbb'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.responses[200] = {
    schema: { 
    "status": true,
    "message": "追蹤成功",
    }
    }
    #swagger.responses[401] = {
    schema: { 
    "message": "你無法追蹤自己",
    "error": {
    "statusCode": 401,
    "isOperational": true
    },
    "stack": "error.message"
    }
    }
  */
  )
  .get(
    "/getFollowingList",
    [isAuth(false), handleErrorAsync(userController.getFollowingList)]
    /*
    #swagger.tags=['Users-會員']
    #swagger.summary = '取得個人追蹤名單'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.responses[200] = {
    schema: { 
    "status": true,
    "followingList": []
    }
    }
  */
  )
  .delete(
    "/:id/unfollow",
    [isAuth(false), handleErrorAsync(userController.unfollow)]
    /* 
    #swagger.tags=['Users-會員']
    #swagger.summary = '取消追蹤其他人 '
    #swagger.description='提供取消追蹤user測試ID: 679349592fd34c3781c33cbb'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.responses[200] = {
    schema: { 
    "status": true,
    "message": []
    }
    }
    #swagger.responses[401] = {
    schema: { 
    "message": "您無法取消追蹤自己",
    "error": {
    "statusCode": 401,
    "isOperational": true
    },
    "stack": "error.message"
    }
    }
  */
  )
  .get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
    // #swagger.ignore = true
  )
  .get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    handleErrorAsync(userController.googleapis)
    // #swagger.ignore = true
  );

// .delete("/userimage/:id", [isAuth(false), handleErrorAsync(userController.userimage)])
module.exports = router;
