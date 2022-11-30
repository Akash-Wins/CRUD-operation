import joi from "joi";

const userSchema = joi.object({
  firstName: joi.string().min(5).max(15).required(),
  lastName: joi.string().min(5).max(15).required(),
  email: joi.string().email().min(5).required(),
  password: joi.string().min(5).max(20).required(),
});

const userLogin = joi.object({
  email: joi.string().email().min(5).required(),
  password: joi.string().min(5).max(20).required(),
});

const userDelete = joi.object({
  firstName: joi.string().min(5).max(15).required(),
  lastName: joi.string().min(5).max(15).required(),
});
const validationHelper = (route, method) => {
  let obj = {};
  switch (method) {
    case "post":
      obj = {
        "/register": userSchema,
        "/login": userLogin,
      };
      return obj[route];
      break;
    case "put":
      obj = {
        "/update": userSchema,
      };
      return obj[route];
      break;
    case "delete":
      obj = {
        "/delete": userDelete,
      };
      return obj[route];
      break;
    default:
  }
};

export default validationHelper;
