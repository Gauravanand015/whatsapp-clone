import createHttpError from "http-errors";
import { createUser, signUser } from "../services/auth.service.js";
import { generateToken } from "../services/token.service.js";
import { verifyUser } from "../services/token.service.js";
import { findUser } from "../services/user.service.js";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res, next) => {
  try {
    const { name, email, password, picture, status } = req.body;
    const newUser = await createUser({
      name,
      email,
      password,
      picture,
      status,
    });

    const accessToken = await generateToken(
      {
        userId: newUser._id,
      },
      "1d",
      process.env.ACCESS_SECRET_KEY
    );

    const refreshToken = await generateToken(
      {
        userId: newUser._id,
      },
      "30d",
      process.env.REFRESH_SECRET_KEY
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/v1/auth/refreshToken",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
      secure: true,
    });

    res.json({
      message: "Register successful",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        status: newUser.status,
        token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await signUser(email, password);

    const accessToken = await generateToken(
      {
        userId: user._id,
      },
      "1d",
      process.env.ACCESS_SECRET_KEY
    );

    const refreshToken = await generateToken(
      {
        userId: user._id,
      },
      "30d",
      process.env.REFRESH_SECRET_KEY
    );

    res.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      path: "/api/v1/auth/refreshToken",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    });

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", { path: "/api/v1/auth/refreshToken" });
    res.json({ message: "User logged out" });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken)
      throw createHttpError.Unauthorized("Please Login First!");
    const check = await verifyUser(
      refreshToken,
      process.env.REFRESH_SECRET_KEY
    );
    let userId = await findUser(check.userId);
    const accessToken = await generateToken(
      {
        userId: userId._id,
      },
      "1d",
      process.env.ACCESS_SECRET_KEY
    );
    res.json({
      user: {
        _id: userId._id,
        name: userId.name,
        email: userId.email,
        picture: userId.picture,
        status: userId.status,
        token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
