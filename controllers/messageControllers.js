const { getMessagesService } = require("../services/messageService");
const getMessages = async (req, res) => {
  const messages = await getMessagesService();
  messages.reverse();
  return res.json({ data: messages });
};

module.exports = {
  getMessages,
};
