import _user from "../Models/user.js";
import Response from "../helpers/responseHelper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import MESSAGE from "../helpers/messageHelper";

class userServices {
  async adduser(req, res) {
    try{
      let email = await _user.findOne({ email: req.body.email });
    if (email) {
      let resPayload = {
        message: MESSAGE.EMAIl_ERROR,
      };
      return Response.error(res, resPayload);
    }
    let myUser = new _user(req.body);
    myUser.save()
        let resPayload = {
          message: MESSAGE.REGISTER_SUCCESSFULLY,
        };
        return Response.success(res, resPayload);
    }
    catch (err) {
      let resPayload = {
        message: err.message
      };
      return Response.error(res, resPayload);
    }
  }

  async login(req, res) {
    try {
      let check = await _user.findOne({ email: req.body.email });
      if (!check) {
        let resPayload = {
          message: MESSAGE.INVALID_CREDENTIALS,
        };
        return Response.error(res, resPayload);
      }
      if (check.isDeleted == true) {
        let resPayload = {
          message: MESSAGE.USER_NOT_EXIST,
        };
        return Response.error(res, resPayload);
      }
      const validPassword = await bcrypt.compare(req.body.password,check.password);
      if (!validPassword) {
        let resPayload = {
          message: MESSAGE.INVALID_CREDENTIALS,
        };
        return Response.error(res, resPayload);
      }
      const token = jwt.sign({ _id: check._id }, process.env.JWT_SECRET,{expiresIn:"1h"});
      let resPayload = {
        message: MESSAGE.LOGIN_SUCCESS,
        payload: { token: token },
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
      let email = await _user.findOne({ email: req.body.email });
      if (email) {
        let resPayload = {
          message: MESSAGE.EMAIl_ERROR,
        };
        return Response.error(res, resPayload);
      }
      const updateId = req.user._id;
      const user = await _user.findByIdAndUpdate(updateId, req.body,{new:true})
      .select("firstName lastName email");
      let resPayload = {
        message: MESSAGE.PROFILE_UPDATED,
        payload: user,
      };
      return Response.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: MESSAGE.SERVER_ERROR,
      };
      return Response.error(res, resPayload);
    }
  }

  async delete(req, res) {
    try {
      const check = await _user.findOne({ _id: req.user._id });
      if (check.isDeleted == true) {
        let resPayload = {
          message: MESSAGE.USER_NOT_FOUND
        };
        return Response.error(res, resPayload);
      }
      const deleteId = req.user._id;
      await _user
        .findByIdAndUpdate(deleteId, { isDeleted: true })
        .then((value) => {
          let resPayload = {
            message: MESSAGE.USER_RECORD_DELETED,
            payload: value.details,
          };
          return Response.success(res, resPayload);
        });
    } catch (err) {
      let resPayload = {
        message: err.message,
      };
      return Response.error(res, resPayload);
    }
  }

}
export default new userServices();


