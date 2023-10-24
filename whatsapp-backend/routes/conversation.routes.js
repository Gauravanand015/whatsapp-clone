import express from "express";
import trimRequest from "trim-request";
import { authentication } from "../middlewares/auth.middleware.js";
import {
  create_open_conversation,
  getConversations,
} from "../controller/conversation.controller.js";
const conversationRoutes = express.Router();

conversationRoutes
  .route("/")
  .post(trimRequest.all, authentication, create_open_conversation);

conversationRoutes
  .route("/")
  .get(trimRequest.all, authentication, getConversations);

export default conversationRoutes;
