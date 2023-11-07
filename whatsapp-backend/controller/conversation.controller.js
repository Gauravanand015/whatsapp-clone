import createHttpError from "http-errors";
import logger from "../config/logger.config.js";
import { doesConversationExist } from "../services/conversation.service.js";
import { findUser } from "../services/user.service.js";
import { createConversation } from "../services/conversation.service.js";
import { populatedConvoData } from "../services/conversation.service.js";
import { getUserConversations } from "../services/conversation.service.js";
import chalk from "chalk";

export const create_open_conversation = async (req, res, next) => {
  try {
    const senderId = req.user.userId;
    const { receiverId } = req.body; // to whom i am sending messages
    console.log("receiverID", receiverId);
    // check if receivers exists
    if (!receiverId) {
      logger.error("Please provide a receiver id you want to chat with");
      throw createHttpError.BadGateway("Something went wrong");
    }
    //check if chat exists
    const existed_conversation = await doesConversationExist(
      senderId,
      receiverId
    );

    if (existed_conversation) {
      res.send(existed_conversation);
    } else {
      const receiver_user_detail = await findUser(receiverId);

      let convoData = {
        name: receiver_user_detail.name,
        picture: receiver_user_detail.picture,
        isGroup: false,
        users: [senderId, receiverId],
      };

      const newConversation = await createConversation(convoData);
      const populatedConvo = await populatedConvoData(
        newConversation._id,
        "users",
        "-password"
      );
      res.status(200).json(populatedConvo);
    }
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    console.log(chalk.red(userId));
    const conversations = await getUserConversations(userId);
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};
