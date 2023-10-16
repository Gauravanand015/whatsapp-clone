import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export const authentication = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) throw createHttpError.Unauthorized();
  jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, payload) => {
    if (err) throw createHttpError.Unauthorized();
    req.user = payload;
    next();
  });
};
