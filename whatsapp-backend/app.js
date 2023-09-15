import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";
import createHttpError from "http-errors";
import router from "./routes/index.js";

//dotEnv config
dotenv.config();

//create express app
const app = express();

//Morgan is an HTTP request level Middleware. It is a great tool that logs the requests along with some other information depending upon its configuration and the preset used. fro example route,time,statusCode, and it should be in development mode
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

//Helmet helps secure Express apps by setting HTTP response headers
app.use(helmet());

//parse json request body
app.use(express.json());

//parse json request url
app.use(express.urlencoded({ extended: true }));

// sanitize Object keys starting with a $ or containing a . are reserved for use by MongoDB as operators. Without this sanitization, malicious users could send an object containing a $ operator, or including a ., which could change the context of a database operation. Most notorious is the $where operator, which can execute arbitrary JavaScript on the database.

// The best way to prevent this is to sanitize the received data, and remove any offending keys, or replace the characters with a 'safe' one.
app.use(mongoSanitize());

//enable cookie parser
app.use(cookieParser());

//Compression in Node. js and Express decreases the downloadable amount of data that's served to users. Through the use of this compression, we can improve the performance of our Node. js applications as our payload size is reduced drastically
app.use(compression());

//file upload
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//cors
app.use(cors());

// routes
app.use("/api/v1", router);

// error handling
app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

export default app;
