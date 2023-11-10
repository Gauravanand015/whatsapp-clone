import createHttpError from "http-errors";
import { UserModel } from "../model/index.js";

export const findUser = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) throw createHttpError.NotFound("User not found");
  return user;
};

export const getSearchUser = async (keyword, userId) => {
  const searchResult = await UserModel.find({
    $or: [
      {
        name: { $regex: keyword, $options: "i" }, // "i" to check for the capital and small letters
      },
    ],
  }).find({
    _id: { $ne: userId },
  });

  return searchResult;
};
