const express = require("express");
const router = express.Router();
const handleErrorAsync = require("../service/handleErrorAsync");
const authController = require("../controllers/authController");
const { isAuth } = require("../service/auth");

router.post(
  "/sign_Up",
  [handleErrorAsync(authController.sign_up)]
  /* 
    #swagger.tags = ['Auth']
    #swagger.summary = '註冊'
    #swagger.description = '註冊'
    #swagger.parameters['body'] = {
    in: 'body',
    description: '註冊資訊',
    required: true,
    schema: {
                $name: 'test',
                $email: 'testUser@mail.com',
                $password: '123456789A',
                $confirmPassword:'123456789A'
        }
    }
    #swagger.responses[201] = {
    schema: { 
    "status": "success",
    "user": {
    "token": "token",
    "name": "testUser"
    },
    "Issued_At": "2024/12/2 下午11:46:41",
    "Expires_At": "2024/12/4 下午11:46:41",
    "Expires_Day": 2
    }
    }
    #swagger.responses[422] = {
    schema: { 
    "message":{
        type: "array",
        items: {
          type: "string",
          examples: [
            "暱稱不能少於兩個字元",
            "密碼需包含至少一個字母和一個數字,並且至少6個字符長",
            "密碼需介於 6-18 字元之間",
            "密碼不一致！",
            "Email 格式不正確"
          ]
        }},
    "error": {
    "statusCode": 422,
    "isOperational": true   
    },
     "stack": "error.message"
    }
    }
    #swagger.responses[402] = {
    schema: { 
    "message": "欄位未填寫正確！",
    "error": {
    "statusCode":402,
    "isOperational": true
    },
     "stack": "error.message"
    }
    }
    #swagger.responses[409] = {
    schema: { 
    "message": "信箱已註冊過~",
    "error": {
    "statusCode": 409,
    "isOperational": true
    },
     "stack": "error.message"
    }
    }
 */
);

router.post(
  "/sign_In",
  [handleErrorAsync(authController.sign_in)]
  /* 
    #swagger.tags = ['Auth']
    #swagger.summary = '登入'
    #swagger.description = '登入'
    #swagger.parameters['body'] = {
    in: 'body',
    description: '登入資訊',
    required:true,
    schema : {
            $email : 'test@mail.com',
            $password : '123456789A'
        }
    }
    #swagger.responses[201] = {
    schema: { 
    "status": "success",
    "user": {
    "token": "token",
    "name": "testUser"
    },
    "Issued_At": "2024/12/9 下午7:41:35",
    "Expires_At": "2024/12/11 下午7:41:35",
    "Expires_Day": 2
    }
    }
    #swagger.responses[401] = {
    schema: { 
    "message": "帳號或密碼輸入錯誤",
    "error": {
    "statusCode": 401,
    "isOperational": true
    },
    "stack":"error.message"
    }
    }
        #swagger.responses[402] = {
    schema: { 
    "message": "帳號密碼不可為空",
    "error": {
    "statusCode": 402,
    "isOperational": true
    },
    "stack":"error.message"
    }
    }
   */
);

router.get(
  "/checkout-token",
  [isAuth(false), handleErrorAsync(authController.tokencheck)]
  /*
  #swagger.tags = ['Auth']
  #swagger.summary = '驗證Token 不會通過資料庫'
  #swagger.description = '單純驗證Token，並不會經過資料庫' 
  #swagger.security = [{"apiKeyAuth": []}]
  #swagger.responses[201] = {
  schema: { 
  "message": "Token 驗證成功",
  "user": {
    "id": "User_id",
    "iat": 1738902806,
    "exp": 1739075606
  }
  }
  }
  #swagger.responses[401] = {
  schema: { 
  "message": "你還沒有登入~~~",
  "error": {
  "statusCode": 401,
  "isOperational": true
  },
  "stack": "error.message"
  }
  }
  #swagger.responses[400] = {
  schema: { 
  "message": "token效期過期請重新登入",
  "error": {
  "statusCode": 400,
  "isOperational": true
  },
  "stack": "error.message"
  }
  }
*/
);
router.get(
  "/checkout-userinfo",
  [isAuth(true), handleErrorAsync(authController.tokencheck)]
  /*
  #swagger.tags = ['Auth']
  #swagger.summary = '驗證Token 透過資料庫取得資料'
  #swagger.description = '初次登入時驗證Token，並透過資料庫索取使用者資料，帶回前端' 
  #swagger.security = [{"apiKeyAuth": []}]
  #swagger.responses[201] = {
  schema: { 
  "message": "Token 驗證成功",
  "user": {
    "_id": "user_id",
    "name": "user_name",
    "email": "user_email",
    "photo": "user_photoemail",
    "sex": "user_sex",
    "createdAt": "2025-02-07T04:33:25.973Z",
    "followers": [],
    "following": []
  }
  }
  }
  #swagger.responses[401] = {
  schema: { 
  "message": "你還沒有登入~~~",
  "error": {
  "statusCode": 401,
  "isOperational": true
  },
  "stack": "error.message"
  }
  }
  #swagger.responses[400] = {
  schema: { 
  "message": "token效期過期請重新登入",
  "error": {
  "statusCode": 400,
  "isOperational": true
  },
  "stack": "error.message"
  }
  }
*/
);

module.exports = router;
