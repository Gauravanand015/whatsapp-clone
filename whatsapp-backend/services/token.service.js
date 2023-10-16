import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

export const generateToken = async (payload, expiresIn, secret) => {
  const token = await jwt.sign(payload, secret, { expiresIn: expiresIn });
  return token;
};

export const verifyUser = async (token, secret) => {
  console.log(token);
  let result = jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      console.error(err);
      throw createHttpError("Invalid token");
    } else {
      return decoded;
    }
  });

  return result;
};
