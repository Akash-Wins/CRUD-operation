import responseHelper from "../helpers/responseHelper.js";
import jwt from "jsonwebtoken"

const authValidation = (req, res, next) => {
  let header = req.headers;
  const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mzg0OTA1ODFhMWUzNGFhOTIyNDM4ZjAiLCJpYXQiOjE2Njk2MzIwODh9.mxT6TrF7mCrF6ZpsjoFI-BASHJBj6N4DvczgsGF4HfA";
  try {
    const decoded = jwt.verify(token, "shhhhh");
    req.user = decoded;
  } catch (err) {
    let resPayload = {
      message: err.message,
      payload: {}
    };
    return responseHelper.error(res, resPayload, 401);
  }
  next();
};
export default authValidation;
