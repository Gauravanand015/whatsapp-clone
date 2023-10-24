import createHttpError from "http-errors";
import { ConversationModel, UserModel } from "../model/index.js";

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
    throw createHttpError.BadRequest("Oops...Something went wrong !");

  //populate message model
  convos = await UserModel.populate(convos, {
    path: "latestMessage.sender",
    select: "name email picture status",
  });

  return convos[0];
};

export const createConversation = async (data) => {
  const newConversation = await ConversationModel.create(data);
  if (!newConversation)
    throw createHttpError.BadRequest("Oops...Something went wrong !");

  return newConversation;
};

export const populatedConvoData = async (id, fieldsToAdd, fieldsToRemove) => {
  const populatedData = await ConversationModel.find({ _id: id }).populate(
    fieldsToAdd,
    fieldsToRemove
  );
  if (!populatedData)
    throw createHttpError.BadRequest("Oops...Something went wrong !");
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
    .then(async (results) => {
      console.log(results);
      results = await UserModel.populate(results, {
        path: "latestMessage.admin",
        select: "name email picture status",
      });

      conversation = results;
    })
    .catch((error) => {
      console.log(error);
      throw createHttpError.BadRequest("Oops...Something went wrong !");
    });

  return conversation;
};
