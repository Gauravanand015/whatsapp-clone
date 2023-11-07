import express from "express";
import trimRequest from "trim-request";
import { authentication } from "../middlewares/auth.middleware.js";
import { searchUser } from "../controller/user.controller.js";

const userRoutes = express.Router();

userRoutes.route("/").get(trimRequest.all, authentication, searchUser);

export default userRoutes;
