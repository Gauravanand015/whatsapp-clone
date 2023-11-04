import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: "string",
      required: [true, "Please provide your name"],
    },
    email: {
      type: "string",
      required: [true, "Please provide your email address"],
      unique: [true, "This email already exists"],
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    picture: {
      type: "string",
      default:
        "https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png",
    },
    status: {
      type: "string",
      default: "Hey there ! I am using whatsapp",
    },
    password: {
      type: "string",
      required: [true, "Please provide your password"],
      minLength: [6, "Please make sure password is at least 6 characters long"],
      maxLength: [
        128,
        "Please make sure password is less then 128 characters long",
      ],
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const UserModel =
  mongoose.models.UserModel || mongoose.model("UserModel", userSchema);

export default UserModel;
