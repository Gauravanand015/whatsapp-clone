import chalk from "chalk";

export default function (socket) {
  socket.on("join", (user) => {
    socket.join(user);
  });

  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
    console.log(chalk.red("Join conversation", conversation));
  });
  // send and receive messages
  socket.on("send message", (message) => {
    let conversation = message.conversation;
    if (!conversation.users) return;
    conversation.users.forEach((user) => {
      if (user._id !== message.sender._id) return;
      socket.in(user._id).emit("message received", message);
    });
  });
}
