const MessageModel = require("../model/message");

const getMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find().populate({ path: "user", select: "name photo" }).sort({ _id: -1 }).limit(20);
    messages.reverse();
    return res.json({ data: messages });
  } catch (error) {
    res.status(400);
    return res.json({ message: error });
  }
};

module.exports = {
  getMessages,
};
