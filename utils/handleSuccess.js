const handleSuccess = (res, message, data) => {
  res
    .send({
      //不用status200因為expressget請求default200
      status: true,
      message,
      data,
    })
    .end();
};

module.exports = handleSuccess;
