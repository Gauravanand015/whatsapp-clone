import express from "express";
import authRouter from "./auth.routes.js";
import conversationRoutes from "./conversation.routes.js";
import messageRoutes from "./message.routes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/conversation", conversationRoutes);
router.use("/messages", messageRoutes);
export default router;
