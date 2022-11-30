import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const userSchema = new Schema({
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
},{timestamps:true});

userSchema.pre("save", async function (next) {
  try {
    const savedPassword = await bcrypt.hash(this.password, 10);
    this.password = savedPassword;
    next();
  } catch {
    next(error);
  }
});

userSchema.plugin(softDeletePlugin);
let _user = mongoose.model("user", userSchema);
export default _user;

