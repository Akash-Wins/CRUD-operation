import mongoose from "mongoose";
import { Schema } from "mongoose";
const quoteSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  by: {
    type: String,
    required: false,
  },
  userId:{
    type:Schema.Types.ObjectId,ref: 'User'
  }
});

const quote = mongoose.model("quotes",quoteSchema)
export default quote

