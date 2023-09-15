import express from "express";
import {
  login,
  logout,
  refreshToken,
  register,
} from "../controller/auth.controller.js";
import trimRequest from "trim-request";

const authRouter = express.Router();

authRouter.route("/register").post(trimRequest.all, register);
authRouter.route("/login").post(trimRequest.all, login);
authRouter.route("/logout").post(trimRequest.all, logout);
authRouter.route("/refreshToken").post(trimRequest.all, refreshToken);

export default authRouter;
