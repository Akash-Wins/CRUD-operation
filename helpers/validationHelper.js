import joi from "joi";

const userSchema = joi.object({
  firstName: joi.string().min(5).max(15).trim().required(),
  lastName: joi.string().min(5).max(15).trim().required(),
  email: joi.string().email().min(5).trim().required(),
  password: joi.string().min(5).max(20).trim().required(),

  address:joi.object({
    houseNo : joi.string().max(6).trim().required(),
    city: joi.string().max(15).trim().required(),
    state: joi.string().max(15).trim().required(),
    pincode: joi.string().max(15).trim().required(),
    country: joi.string().max(20).trim().required()
  })
});

const userUpdate = joi.object({
  firstName: joi.string().min(5).max(15).trim(),
  lastName: joi.string().min(5).max(15).trim(),
  email: joi.string().email().min(5).trim(),
  password: joi.string().min(5).max(20).trim(),
  address:joi.object({
    houseNo : joi.string().max(6).trim().required(),
    city: joi.string().max(15).trim().required(),
    state: joi.string().max(15).trim().required(),
    pincode: joi.string().max(15).trim().required(),
    country: joi.string().max(20).trim().required()
  })
});

const userLogin = joi.object({
  email: joi.string().email().min(5).trim().required(),
  password: joi.string().min(5).max(20).trim().required(),
});

const userDelete = joi.object({
  firstName: joi.string().min(5).max(15).trim().required(),
  lastName: joi.string().min(5).max(15).trim().required(),
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
        "/update":userUpdate,
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
