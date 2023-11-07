import createHttpError from "http-errors";
import { getSearchUser } from "../services/user.service.js";

export const searchUser = async (req, res, next) => {
  try {
    const keyword = req.query.search;
    if (!keyword) {
      res.json("Please add a search keyword");
      throw createHttpError.BadRequest(
        "Oops...Something went wrong in the search user route"
      );
    }

    const user = await getSearchUser(keyword);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
