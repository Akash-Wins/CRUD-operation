import Response from "./response_helper";
class Helper {
  success(res, data, statuscode = 200) {
    return Response.success(res, data, statuscode);
  }
  error(res, data, statuscode = 200) {
    return Response.error(res, data, statuscode);
  }
}
export default new Helper