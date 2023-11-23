import logger from "../config/logger.config.js";
import { createMessage } from "../services/message.service.js";
import { populateMessage } from "../services/message.service.js";
import { updateLatestMessage } from "../services/conversation.service.js";
import { getConvoMessages } from "../services/message.service.js";
import chalk from "chalk";

export const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.userId;
    const { message, convo_id, files } = req.body;
    // console.log(message, convo_id);

    if (!convo_id || (!message && !files)) {
      logger.error("Please provide convo_id and messages body");
      return res.sendStatus(400);
    } else {
      const messageData = {
        sender: senderId,
        conversation: convo_id,
        message,
        files: files || [],
      };
      const newMessage = await createMessage(messageData);

      // console.log(chalk.red(newMessage));

      const populatedMessage = await populateMessage(newMessage._id);

      await updateLatestMessage(convo_id, newMessage);
      res.send(populatedMessage);
    }
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const convo_id = req.params.convo_id;
    if (!convo_id) {
      logger.error("Please add a conversation id in params.");
      res.sendStatus(400);
    }
    const messages = await getConvoMessages(convo_id);
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
