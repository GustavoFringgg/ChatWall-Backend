const MessageModel = require("../model/message");

const getMessages = async (req, res) => {
  const query = {};
  for (let q in req.query) {
    query[q] = req.query[q];
  }
  try {
    const messages = await MessageModel.find().populate({ path: "user", select: "name photo" }).sort({ _id: -1 }).limit(20);
    messages.reverse();
    return res.json({ data: messages });
  } catch (error) {
    res.status(400);
    return res.json({ message: error });
  }
};

const createMessages = async (req, res) => {
  console.log("create觸發");
  let { user, content } = req.body;
  console.log("createuser", user);
  console.log("creatcontent", content);
  content = content.trim();
  if (!user || !content) {
    res.status(400);
    return res.json({ message: "欄位錯誤" });
  }
  try {
    const newMessage = await MessageModel.create({ user, content });
    return res.json({ message: "新增成功", data: newMessage });
  } catch (error) {
    return res.json({ message: error });
  }
};

module.exports = {
  getMessages,
  createMessages,
};
