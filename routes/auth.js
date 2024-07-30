const express = require("express");
const router = express.Router();
const handleErrorAsync = require("../service/handleErrorAsync");
const authController = require("../controllers/authController");

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
                $name: '王小明',
                $email: 'AA@gmail.com',
                $password: 'Aa123456',
                $confirmPassword:'Aa123456'
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
   */
);

module.exports = router;
