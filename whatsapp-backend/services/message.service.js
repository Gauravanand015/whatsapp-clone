import createHttpError from "http-errors";
import { MessageModel } from "../model/index.js";
import chalk from "chalk";

export const createMessage = async (data) => {
  const newMessage = await MessageModel.create(data);
  if (!newMessage)
    throw createHttpError.BadRequest(
      "Oops...Something went wrong in createMessage function!"
    );

  return newMessage;
};

export const populateMessage = async (id) => {
  const msg = await MessageModel.findById({ _id: id })
    .populate({
      path: "sender", // key in the message model where I have use the ObjectId of the UserModel,
      select: "name picture", // which properties you want to populated
      model: "UserModel", // from which model the data is being populated
    })
    .populate({
      path: "conversation",
      select: "name picture isGroup users",
      model: "ConversationModel",
      populate: {
        path: "users",
        select: "name email picture status",
        model: "UserModel",
      },
    });

  if (!msg)
    throw createHttpError.BadRequest(
      "Oops...Something went wrong in populateMessage function!"
    );
  // console.log(chalk.bold(msg));
  return msg;
};

export const getConvoMessages = async (convo_id) => {
  const messages = await MessageModel.find({ conversation: convo_id })
    .populate("sender", "name picture email status")
    .populate("conversation");
  if (!messages) {
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  }
  return messages;
};
