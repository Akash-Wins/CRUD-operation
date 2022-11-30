import responseHelper from "../helpers/responseHelper.js";
import jwt from "jsonwebtoken";

class Validation {
  authValidation(req, res, next) {
    const header = req.headers.authorization;
    const token = header.replace("Bearer ", "");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      let resPayload = {
        message: err.message,
        payload: {},
      };
      return responseHelper.error(res, resPayload, 401);
    }
    next();
  }
}

export default new Validation();
