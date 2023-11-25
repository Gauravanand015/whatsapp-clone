import app from "./app.js";
import { Server } from "socket.io";
import logger from "./config/logger.config.js";
import mongoose from "mongoose";
import SocketServer from "./utils/socketDetails.js";
const PORT = process.env.PORT || 8000;
const CLIENT_ENDPOINT = process.env.CLIENT_ENDPOINT;

//exit on mongodb error
mongoose.connection.on("error", (err) => {
  logger.error(`MongoDb connection error: ${err}`);
  process.exit(1);
});

//debug
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

// mongoDb connection
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to MongoDB");
  });

const server = app.listen(PORT, () => {
  logger.info(`${process.env.NODE_ENV}`);
  logger.info(`Server is listening at ${PORT}...`);
});

// socket.io connection

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: CLIENT_ENDPOINT,
  },
});

io.on("connection", (socket) => {
  // console.log(socket);
  logger.info("socket.io connected successfully");
  SocketServer(socket);
});
