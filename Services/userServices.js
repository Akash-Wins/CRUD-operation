import _user from "../Models/user.js";
import Response from "../helpers/responseHelper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import MESSAGE from "../helpers/messageHelper";
import uploadFile from "../helpers/uploadFileHelper.js";
import quote from "../Models/quoteSchema.js";

class userServices {
  async adduser(req, res) {
    try {
      let email = await _user.findOne({ email: req.body.email });
      if (email) {
        let resPayload = {
          message: MESSAGE.EMAIl_ERROR,
        };
        return Response.error(res, resPayload);
      }

      let myUser = new _user(req.body);
      myUser.save();
      let resPayload = {
        message: MESSAGE.REGISTER_SUCCESSFULLY,
      };
      return Response.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: err.message,
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
      const validPassword = await bcrypt.compare(
        req.body.password,
        check.password
      );
      if (!validPassword) {
        let resPayload = {
          message: MESSAGE.INVALID_CREDENTIALS,
        };
        return Response.error(res, resPayload);
      }
      const token = jwt.sign({ _id: check._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
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
      const user = await _user.findById(profileID);
      let resPayload = {
        message: MESSAGE.PROFILE,
        payload: user,
      };
      return Response.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: err.message,
      };
      return Response.error(res, resPayload);
    }
  }

  async update(req, res) {
    try {
      const updateId = req.user._id;
      let email = await _user.findOne({ email: req.body.email,_id:{$ne:updateId} }).lean();
      if (email) {
        let resPayload = {
          message: MESSAGE.EMAIl_ERROR,
        };
        return Response.error(res, resPayload);
      }
      const user = await _user
        .findByIdAndUpdate(updateId, req.body, { new: true })
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
          message: MESSAGE.USER_NOT_FOUND,
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

  async multerServices(req, res) {
    await uploadFile(req, res, (err) => {
      if (err) {
        //res.send(err);
        res.status(500).send({
          message: MESSAGE.IMAGE_UPLOAD_FAILED,
        });
      } else {
        res.status(200).send({
          message: MESSAGE.IMAGE_UPLOAD_SUCCESSFULLY,
        });
        // res.send(req.files)
      }
    });
  }
  async addQuoteUser(req, res) {
    try {
      const user_id = req.user._id;
      const addQuots = {
        title: req.body.title,
        by: req.body.by,
        userId: user_id,
      };
      const myQuotes = await new quote(addQuots);
      myQuotes.save();
      let resPayload = {
        message: MESSAGE.QUOTE_ADD_SUCCESSFULLY,
      };
      return Response.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: err.message,
      };
      return Response.error(res, resPayload);
    }
  }
  async quoteDetail(req, res) {
    try {
      const user_id = req.user._id;
      const user = await _user.findById(user_id,{_id:0,firstName:1,email:1});
      const QuoteData= await quote.find({userId:user_id},{_id:0,title:1})
      // const QuoteFind = QuoteData.map((item)=>{
      //   return ({title:item.title ,by:item.by})
      // })
      const finalOutput={
        // firstName :user.firstName,
        // lastName:user.lastName,
        // email:user.email,
        quotes:QuoteData,
        by:user
        }
      let resPayload = {
        message: MESSAGE.QUOTE_RECORD,
        payload: finalOutput,
      };
      return Response.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: err.message,
      };
      return Response.error(res, resPayload);
    }
  }
  async quoteDemo(req,res){
    const result = await _user.aggregate([
      {
          '$lookup': {
              'from': 'quotes', 
              'localField': '_id', 
              'foreignField': 'userId', 
              'as': 'quotes'
          }
      },{
        '$project': {
            'firstName': 1, 
            'quotes': {
                'title': 1
            }
        }
    },
     {
          '$unwind': {
              'path': '$quotes', 
              'preserveNullAndEmptyArrays': false
          }
      }, {
          '$group': {
              '_id': '$_id', 
              'firstname': {
                  '$first': '$firstName'
              }, 
              'quotes': {
                  '$push': '$quotes'
              }
          }
      }
  ])
    return res.send(result)
  }
}
export default new userServices();
