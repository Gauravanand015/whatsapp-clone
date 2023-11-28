import chalk from "chalk";

let onlineUsers = [];

export default function (socket, io) {
  socket.on("join", (user) => {
    socket.join(user);

    // add joined user to online users
    if (!onlineUsers.some((onlineUser) => onlineUser.userId === user)) {
      // console.log(chalk.red(`this ${user} is online`));
      onlineUsers.push({ userId: user, socketId: socket.id });
    }

    // send online user to frontend
    io.emit("get-online-user", onlineUsers);

    // socket disconnects
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter(
        (onlineUser) => onlineUser.socketId !== socket.id
      );
      // console.log(chalk.red(`this ${socket.id} is disconnected`));
      io.emit("get-online-user", onlineUsers);

      //! we are using io because as the users got disconnected the socket disconnect too so it is impossible to emit something, to to rectify the problem we are using io instead
    });
  });

  // join conversation room
  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
  });
  // send and receive messages
  socket.on("send message", (message) => {
    let conversation = message.conversation;
    if (!conversation.users) return;
    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit("receive message", message);
    });
  });
}
