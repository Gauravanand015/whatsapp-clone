import chalk from "chalk";

let onlineUsers = [];

export default function (socket, io) {
  // Event handler for "join" event
  socket.on("join", (user) => {
    socket.join(user);

    // Add joined user to online users if not already present
    if (!onlineUsers.some((onlineUser) => onlineUser.userId === user)) {
      console.log(chalk.red(`User ${user} is online`));
      onlineUsers.push({ userId: user, socketId: socket.id });
    }

    // Send online user list to frontend
    io.emit("get-online-user", onlineUsers);

    // Event handler for socket disconnects
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter(
        (onlineUser) => onlineUser.socketId !== socket.id
      );

      // Emit updated online user list to all connected clients
      io.emit("get-online-user", onlineUsers);

      // Send socket ID to all connected clients
      io.emit("setup socket", socket.id);
    });
  });

  // Event handler for "join conversation" event
  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
  });

  // Event handler for "send message" event
  socket.on("send message", (message) => {
    let conversation = message.conversation;
    if (!conversation.users) return;

    // Broadcast the message to all users in the conversation except the sender
    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit("receive message", message);
    });
  });

  // Event handler for "typing" event
  socket.on("typing", (conversation) => {
    socket.in(conversation).emit("typing", conversation);
  });

  // Event handler for "stop typing" event
  socket.on("stop typing", (conversation) => {
    socket.in(conversation).emit("stop typing");
  });

  // Event handler for "call user" event
  socket.on("call user", (data) => {
    console.log(data);
    const userId = data.userToCall;
    console.log("USER ID", userId);
    console.log("ONLINE USERS", onlineUsers);

    // Find the user in onlineUsers based on userId
    const userSocket = onlineUsers.find((user) => user.userId === userId);

    // Handle case where the user is not found
    if (!userSocket) {
      console.log(`User with ID ${userId} is not online.`);
      return;
    }

    console.log("USER SOCKET ID", userSocket.socketId);

    // Emit "call user" event to the specific user
    io.to(userSocket.socketId).emit("call user", {
      signal: data.signal,
      form: data.from,
      name: data.name,
      picture: data.picture,
    });
  });
}
