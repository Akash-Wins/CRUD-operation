import _user from "../Models/user.js";
import  Response  from "../helpers/responseHelper.js";

class userServices{
    adduser(req,res){       
        let myUser =new _user(req.body);
        myUser.save()
        .then((value)=>{
                let resPayload={
                    message:'successfully added data',
                    payload: myUser
                };
                return Response.success(res,resPayload)
            
        })
        .catch(err=>{
            res.status(400).send("email id already exist")
        })
    }
    
    async login(req,res){
        let check = await  _user.findOne({email:req.body.email})
        if(!check)return res.staus(401).send("wrong email");
        return res.status(200).send(check)
    }
}
export default new userServices();