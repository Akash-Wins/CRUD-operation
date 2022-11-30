import validationHelper from "../helpers/validationHelper.js";
import responseHelper from "../helpers/responseHelper.js";
import MESSAGE from "../helpers/messageHelper.js";
class Middleware{
    JoiMiddleware(req, res, next){
        // to get method from request------------tolowercase
        let route = req.route.path;
        let method = req.method.toLowerCase();
        // to get route from request
      
        let schema = validationHelper(route, method);
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
          return responseHelper.error(res, {
            message:  MESSAGE.VALIDATION_ERROR,
            payload: error.details,
          });
        }
        next();
      };
}

export default new Middleware;
