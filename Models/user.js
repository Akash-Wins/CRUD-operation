import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt"
const userSchema =new Schema({
    firstName:{
        type: String,
        required:false
    },
    lastName:{
        type: String,
        required:false
    },
    email:{
        type: String,
        required:false,
        unique:true
    },
    password:{
        type:String,
        required:false
    }
})

userSchema.pre("save", async next => {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});
let _user =mongoose.model("user",userSchema)
export default _user;