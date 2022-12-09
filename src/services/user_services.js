import _user from "../models/user.js";
import Helper from "../helpers/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import MESSAGE from "../helpers/message_helper";
import uploadFile from "../helpers/upload_helper.js";
import quote from "../models/quote.js";

class userServices {
  async addUser(req, res) {
    try {
      let email = await _user.findOne({ email: req.body.email });
      if (email) {
        let resPayload = {
          message: MESSAGE.EMAIl_ERROR,
        };
        return Helper.error(res, resPayload);
      }

      let user = new _user(req.body);
      user.save();
      let resPayload = {
        message: MESSAGE.REGISTER_SUCCESSFULLY,
      };
      return Helper.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: err.message,
      };
      return Helper.error(res, resPayload);
    }
  }

  async login(req, res) {
    try {
      let check = await _user.findOne({ email: req.body.email });
      if (!check) {
        let resPayload = {
          message: MESSAGE.INVALID_CREDENTIALS,
        };
        return Helper.error(res, resPayload);
      }
      if (check.isDeleted == true) {
        let resPayload = {
          message: MESSAGE.USER_NOT_EXIST,
        };
        return Helper.error(res, resPayload);
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        check.password
      );
      if (!validPassword) {
        let resPayload = {
          message: MESSAGE.INVALID_CREDENTIALS,
        };
        return Helper.error(res, resPayload);
      }
      const token = jwt.sign({ _id: check._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      let resPayload = {
        message: MESSAGE.LOGIN_SUCCESS,
        payload: { token: token },
      };
      return Helper.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: err.message,
        payload: {},
      };
      return Helper.error(res, resPayload);
    }
  }

  async profile(req, res) {
    try {
      const userId = req.user._id;
      const user = await _user.findById(userId);
      let resPayload = {
        message: MESSAGE.PROFILE,
        payload: user,
      };
      return Helper.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: err.message,
      };
      return Helper.error(res, resPayload);
    }
  }

  async update(req, res) {
    try {
      const userId = req.user._id;
      let email = await _user.findOne({ email: req.body.email, _id: { $ne: userId } }).lean();
      if (email) {
        let resPayload = {
          message: MESSAGE.EMAIl_ERROR,
        };
        return Helper.error(res, resPayload);
      }
      const user = await _user
        .findByIdAndUpdate(userId, req.body, { new: true })
        .select("firstName lastName email");
      let resPayload = {
        message: MESSAGE.PROFILE_UPDATED,
        payload: user,
      };
      return Helper.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: MESSAGE.SERVER_ERROR,
      };
      return Helper.error(res, resPayload);
    }
  }

  async delete(req, res) {
    try {
      const userId = await _user.findOne({ _id: req.user._id });
      if (userId.isDeleted == true) {
        let resPayload = {
          message: MESSAGE.USER_NOT_FOUND,
        };
        return Helper.error(res, resPayload);
      }
      const deleteId = req.user._id;
      await _user
        .findByIdAndUpdate(deleteId, { isDeleted: true })
        .then((value) => {
          let resPayload = {
            message: MESSAGE.USER_RECORD_DELETED,
            payload: value.details,
          };
          return Helper.success(res, resPayload);
        });
    } catch (err) {
      let resPayload = {
        message: err.message,
      };
      return Helper.error(res, resPayload);
    }
  }

  async addFile(req, res) {
    try{
      await uploadFile(req, res, (err) => {
        if (err) {
          let resPayload = {
            message: MESSAGE.IMAGE_UPLOAD_FAILED,
          };
          return Helper.error(res, resPayload);
        } else {
          let resPayload = {
            message: MESSAGE.IMAGE_UPLOAD_SUCCESSFULLY,
          };
          return Helper.success(res, resPayload);
        }
      });
    }
    catch (err) {
      let resPayload = {
        message:MESSAGE.SERVER_ERROR,
      };
      return Helper.error(res, resPayload);
    }
  }
  async addQuoteUser(req, res) {
    try {
      const user_id = await _user.findOne({ _id: req.user._id });
      if (user_id.isDeleted == true) {
        let resPayload = {
          message: MESSAGE.USER_NOT_FOUND,
        };
        return Helper.error(res, resPayload);
      }
      const userId = req.user._id;
      const addQuots = {
        title: req.body.title,
        by: req.body.by,
        userId: userId,
      };
      const quotes = await new quote(addQuots);
      quotes.save();
      let resPayload = {
        message: MESSAGE.QUOTE_ADD_SUCCESSFULLY,
      };
      return Helper.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: err.message,
      };
      return Helper.error(res, resPayload);
    }
  }
  async quoteAllDetails(req, res) {
    try {
      const quoteResult = await _user.aggregate([
        {
          '$lookup': {
            'from': 'quotes', 
            'localField': '_id', 
            'foreignField': 'userId', 
            'as': 'quotes'
          }
        }, {
          '$project': {
            '_id': 0, 
            'quotes': {
              'title': 1,
              'by': "$firstName"
            }
          }
        }
      ]);
      let resPayload = {
        message: MESSAGE.QUOTE_RECORD,
        payload: quoteResult,
      };
      return Helper.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: err.message,
      };
      return Helper.error(res, resPayload);
    }
  }
  async quoteSingleDetail(req, res) {
    try {
      const userId = req.user._id;
      const quoteResult = await _user.aggregate([
        {
          $match: {
            _id: userId,
          },
        },
        {
          $lookup: {
            from: "quotes",
            localField: "_id",
            foreignField: "userId",
            as: "quotes",
          },
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            quotes: {
              title: 1,
            },
          },
        },
        {
          $unwind: {
            path: "$quotes",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $group: {
            _id: "$_id",
            firstname: {
              $first: "$firstName",
            },
            quotes: {
              $push: "$quotes",
            },
          },
        },
      ]);
      let resPayload = {
        message: MESSAGE.QUOTE_RECORD,
        payload: quoteResult,
      };
      return Helper.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: err.message,
      };
      return Helper.error(res, resPayload);
    }
  }
}
export default new userServices();
