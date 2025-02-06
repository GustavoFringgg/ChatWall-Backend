const socketIO = require("socket.io");
const Message = require("../model/message");
const mongoose = require("mongoose");
const messageBuffer = [];
const SAVE_INTERVAL = 20000;

function connectSocketIo(server) {
  const io = new socketIO.Server(server); //初始化
  io.on("connection", (socket) => {
    socket.on("chatMessage", async (messagePayload) => {
      const { content } = messagePayload;
      const { userid, username, photo } = messagePayload.user;
      const objectId = new mongoose.Types.ObjectId(userid);
      messageBuffer.push({
        user: {
          userid,
          username,
          photo,
        },
        content,
        createdAt: new Date(),
      });
      // try {
      //   const message = await Message.create({
      //     user: objectId,
      //     content,
      //   });
      io.emit("chatMessage", {
        user: {
          username,
          photo,
        },
        content,
        createdAt: new Date(),
      });

      // } catch (error) {
      //   console.error(error);
      // }
    });
  });
  setInterval(async () => {
    if (messageBuffer.length > 0) {
      console.log("緩存啟動，準備寫入資料...");
      try {
        const messageToInsert = messageBuffer.map((message) => ({
          user: new mongoose.Types.ObjectId(message.user.userid),
          content: message.content,
          createdAt: message.createdAt,
        }));
        await Message.insertMany(messageToInsert);
        messageBuffer.length = 0;
        console.log("批次寫入資料庫成功");
      } catch (error) {
        console.error("資料寫入失敗", error);
      }
    }
  }, SAVE_INTERVAL);

  process.on("exit", async () => {
    if (messageBuffer.length > 0) {
      console.log("伺服器關閉，寫入剩餘緩存...");
      try {
        const messageToInsert = messageBuffer.map((message) => ({
          user: new mongoose.Types.ObjectId(message.user.userid),
          content: message.content,
          createdAt: message.createdAt,
        }));
        await Message.insertMany(messageToInsert);
        console.log("剩餘緩存寫入成功");
      } catch (error) {
        console.error("伺服器關閉時，緩存寫入失敗", error);
      }
    }
  });
}
module.exports = connectSocketIo;
