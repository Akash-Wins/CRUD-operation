import { Schema } from "mongoose";
export const addressSchema = new Schema(
    {
        houseNo: {
            type: String,
            required: false,
          },
          city: {
            type: String,
            required: false,
          },
          state: {
            type: String,
            required: false,
          },
          pincode : {
            type: String,
            required: false,
          },
          country:{
            type: String,
            required: false,
        },
    }
  );
  module.exports = addressSchema
 