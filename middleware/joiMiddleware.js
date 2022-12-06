import validationHelper from "../helpers/validationHelper.js";
import responseHelper from "../helpers/responseHelper.js";
import MESSAGE from "../helpers/messageHelper.js";
class Middleware {
  JoiMiddleware(req, res, next) {
    // to get route from request
    let route = req.route.path;
    // to get method from request------------tolowercase
    let method = req.method.toLowerCase();

    let schema = validationHelper(route, method);
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      let Validation_error = error.details.map((err)=>{
        let userError ={};
        Object.assign(userError,{message:err.message.replace(/[\,"]/g,' '),path:err.path.toString()});
        return userError;
      })
        let payload={
          message: MESSAGE.VALIDATION_ERROR,
          payload: Validation_error,
        }
       return responseHelper.error(res,payload);
    }
    next();
  }
}

export default new Middleware();



