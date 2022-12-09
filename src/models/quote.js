import mongoose from "mongoose";
import { Schema } from "mongoose";
import { nanoid } from "nanoid";
const quoteSchema = new Schema({
  _id: {
    type: String,
    default: () => nanoid()
  },
  title: {
    type: String,
    required: false,
  },
  userId:{
    type: String,
    required:true
  }
});

const quote = mongoose.model("quotes",quoteSchema)
export default quote

