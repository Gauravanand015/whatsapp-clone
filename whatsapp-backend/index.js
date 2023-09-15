import app from "./app.js";
import logger from "./config/logger.config.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 8000;

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

app.listen(PORT, () => {
  logger.info(`${process.env.NODE_ENV}`);
  logger.info(`Server is listening at ${PORT}...`);
});
