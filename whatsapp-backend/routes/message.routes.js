import express from "express";
import trimRequest from "trim-request";
import { authentication } from "../middlewares/auth.middleware.js";
import { sendMessage, getMessages } from "../controller/message.controller.js";

const messageRoutes = express.Router();

messageRoutes.route("/").post(trimRequest.all, authentication, sendMessage);
messageRoutes
  .route("/:convo_id")
  .get(trimRequest.all, authentication, getMessages);

export default messageRoutes;
