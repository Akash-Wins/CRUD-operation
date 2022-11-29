// import multer from "multer";
//import { Schema } from "mongoose";
import userServices from "../Services/userServices.js";
import JoiMiddleware from "../middleware/joiMiddleware.js";
import authValidation from "../middleware/authMiddleware.js";
import bodyparser from 'express'


const Route=(app)=>{
    app.use(bodyparser.urlencoded({extended:true}));
    app.use(bodyparser.json());
    app.post('/register', JoiMiddleware, userServices.adduser);
    app.post('/login',[authValidation,JoiMiddleware],userServices.login)
}


export default Route;