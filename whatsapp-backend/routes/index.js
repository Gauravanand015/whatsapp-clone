import express from "express";
import authRouter from "./auth.routes.js";
import conversationRoutes from "./conversation.routes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/conversation", conversationRoutes);
export default router;
