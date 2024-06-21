const appError = (httpStatus, errMessage, next) => {
  //appError=(狀態碼、err錯誤訊息、傳送err資訊到處理錯誤 middleware 的 next)
  const error = new Error(errMessage); //設立一個實體error建構子
  error.statusCode = httpStatus; //將傳進function的httpStatus放進去error.statusCode
  error.isOperational = true; //錯誤操作是否為可預期的
  return error;
};

module.exports = appError;

//制定的錯誤資訊，回傳錯誤建構子(垃圾車在這裡產生)
