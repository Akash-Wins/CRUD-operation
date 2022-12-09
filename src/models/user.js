import { nanoid } from 'nanoid'
import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { addressSchema } from "./address";

const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => nanoid()
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    address:addressSchema,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    const savedPassword = await bcrypt.hash(this.password, 10);
    this.password = savedPassword;
    next();
  } catch {
    next(error);
  }
});

userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    if (this._update.password) {
      const passwordhash = await bcrypt.hash(this._update.password, 10);
      this._update.password = passwordhash;
    }
    next();
  } catch {
    return next(error);
  }
});


let _user = mongoose.model("user", userSchema);
export default _user;


