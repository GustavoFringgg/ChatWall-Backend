const MessageModel = require("../model/message");

const getMessagesService = async () => {
  return await MessageModel.find().populate({ path: "user", select: "name photo" }).sort({ _id: -1 }).limit(20);
};

module.exports = { getMessagesService };
