const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userID, socketID) => {
  !users.some((user) => user.userID === userID) &&
    users.push({ userID, socketID });
};

const removeUser = (socketID) => {
  users = users.filter((user) => user.socketID !== socketID);
};

const getUser = (userID) => {
  return users.find((user) => user.userID === userID);
};

io.on("connection", (socket) => {
  //when connect
  console.log("a user connected.");

  //take userID and socketID from user
  socket.on("addUser", (userID) => {
    addUser(userID, socket.id);
  });

  // send and get notification on timer
  socket.on("sendNotification", ({ receiverID, type, reservationDuration }) => {
    const receiver = getUser(receiverID);
    if (type === 'start')
      io.to(receiver.socketID).emit("getNotification", {
        type,
      });
    else if (type === 'stop')
      io.to(receiver.socketID).emit("getNotification", {
        type,
        reservationDuration
      });
    else if (type === 'paid')
      io.to(receiver.socketID).emit("getNotification", {
        type
      });
    else if (type === 'approved')
      io.to(receiver.socketID).emit("getNotification", {
        type
      });
  });

  //send and get message
  socket.on("sendMessage", ({ senderID, senderName, receiverID, message, senderImageURL }) => {
    const user = getUser(receiverID);
    if (user) {
      io.to(user.socketID).emit("getMessage", {
        senderID,
        senderName,
        message,
        senderImageURL
      });
    }
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
