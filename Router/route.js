import userServices from "../Services/userServices.js";
import Middleware from "../middleware/joiMiddleware.js";
import Validation from "../middleware/authMiddleware.js";
import bodyparser from 'express';


const Route=(app)=>{
    app.use(bodyparser.urlencoded({extended:true}));
    app.use(bodyparser.json());
    app.post('/register',Middleware.JoiMiddleware, userServices.adduser);
    app.post('/login',Middleware.JoiMiddleware,userServices.login);
    app.get('/profile',Validation.authValidation,userServices.profile);
    app.put('/update',Validation.authValidation,userServices.update);
    app.delete('/delete',Validation.authValidation,userServices.delete)
}


export default Route;