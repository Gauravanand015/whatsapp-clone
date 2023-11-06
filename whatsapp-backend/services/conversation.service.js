import createHttpError from "http-errors";
import { ConversationModel, UserModel } from "../model/index.js";
import chalk from "chalk";

export const doesConversationExist = async (senderId, receiverId) => {
  let convos = await ConversationModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: senderId } } },
      { users: { $elemMatch: { $eq: receiverId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (!convos)
    throw createHttpError.BadRequest(
      "Oops...Something went wrong in doesConversationExist function!"
    );
  console.log(chalk.blue("convo one", convos));
  //populate message model
  convos = await UserModel.populate(convos, {
    path: "latestMessage.sender",
    select: "name email picture status", // the properties which i want to get  as result
  });
  console.log(chalk.yellow("convo two", convos));
  return convos[0];
};

export const createConversation = async (data) => {
  const newConversation = await ConversationModel.create(data);
  if (!newConversation)
    throw createHttpError.BadRequest(
      "Oops...Something went wrong in createConversation function!"
    );

  return newConversation;
};

export const populatedConvoData = async (id, fieldsToAdd, fieldsToRemove) => {
  const populatedData = await ConversationModel.findOne({ _id: id }).populate(
    fieldsToAdd,
    fieldsToRemove
  );
  if (!populatedData)
    throw createHttpError.BadRequest(
      "Oops...Something went wrong in populatedConvoData function!"
    );
  console.log(chalk.greenBright(populatedData));
  return populatedData;
};

export const getUserConversations = async (userId) => {
  let conversation;
  await ConversationModel.find({
    users: { $elemMatch: { $eq: userId } },
  })
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      console.log(chalk.blueBright(results));
      results = await UserModel.populate(results, {
        path: "latestMessage.sender",
        select: "name email picture status",
      });

      conversation = results;
    })
    .catch((error) => {
      console.log(error);
      throw createHttpError.BadRequest(
        "Oops...Something went wrong in getUserConversation function!"
      );
    });

  return conversation;
};

export const updateLatestMessage = async (conversationId, message) => {
  const updateConvo = await ConversationModel.findByIdAndUpdate(
    conversationId,
    {
      latestMessage: message,
    }
  );

  if (!updateConvo)
    throw createHttpError.BadRequest(
      "Oops....Something went wrong in updateLatestMessage function!"
    );
  return updateConvo;
};
