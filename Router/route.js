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
    app.put('/update',Middleware.JoiMiddleware,Validation.authValidation,userServices.update);
    app.delete('/delete',Validation.authValidation,userServices.delete);
    app.post("/upload",userServices.multerServices);
    app.post("/quote",Validation.authValidation,Middleware.JoiMiddleware,userServices.addQuoteUser)
    app.get("/quotedata",Validation.authValidation,userServices.quoteDetail)
    app.get("/quotegetdemo",userServices.quoteDemo)
}

export default Route;