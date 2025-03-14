const handleErrorAsync = (func) => {
  return (req, res, next) => {
    //再執行函式，async 可再用 catch 統一捕捉
    func(req, res, next).catch((error) => {
      next(error);
    });
  };
};
//handleErrorAsync(postController.getPosts =func)
//將async function 丟進參數，回傳+catch的middleware
// func 先將 async fun 帶入參數儲存
// middleware 先接住 router 資料
module.exports = handleErrorAsync;
