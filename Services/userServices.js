import _user from "../Models/user.js";
import Response from "../helpers/responseHelper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import MESSAGE from "../helpers/messageHelper";
class userServices {
  adduser(req, res) {
    let myUser = new _user(req.body);

    myUser
      .save()
      .then((value) => {
        let resPayload = {
          message: MESSAGE.USER,
          payload: value,
        };
        return Response.success(res, resPayload);
      })
      .catch((err) => {
        let resPayload = {
          message: MESSAGE.USER_ERROR,
        };
        return Response.error(res, resPayload);
      });
  }

  async login(req, res) {
    let check = await _user.findOne({ email: req.body.email });
    if (!check) {
      let resPayload = {
        message: MESSAGE.LOGIN_ERROR,
      };
      return Response.error(res, resPayload);
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (!validPassword) {
      let resPayload = {
        message: err.message,
      };
      return Response.error(res, resPayload);
    }
    const token = jwt.sign({ _id: check._id }, process.env.JWT_SECRET);
    let resPayload = {
      message: MESSAGE.LOGIN_SUCCESS,
      payload: { token: token },
    };
    return Response.success(res, resPayload);
  }
  async profile(req, res) {
    try {
      const profileID = req.user._id;
      const user = await _user
        .findById(profileID)
        .select("firstName lastName email");
      let resPayload = {
        message: MESSAGE.PROFILE,
        payload: user,
      };
      return Response.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: err.message,
        payload: {},
      };
      return Response.error(res, resPayload);
    }
  }
  async update(req, res) {
    try {
      const updateId = req.user._id;
      const user = await _user
        .findByIdAndUpdate(updateId, req.body)
        .select("firstName lastName email");
      let resPayload = {
        message: MESSAGE.PROFILE_UPDATED,
        payload: user,
      };
      return Response.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: err.message,
        payload: {},
      };
      return Response.error(res, resPayload);
    }
  }
  async deleted(req, res) {
    try {
      const deleteId = req.user._id;
      const user = await _user.findByIdAndRemove(deleteId,req.body);
      let resPayload = {
        message: MESSAGE.DELETE,
        payload: user,
      };
      return Response.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: MESSAGE.DELETE_ERROR,
        payload: {},
      };
      return Response.error(res, resPayload);
    }
  }
}
export default new userServices();
