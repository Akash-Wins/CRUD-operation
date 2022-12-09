import userServices from "../services/user_services.js";
import Middleware from "../middleware/joi_middleware.js";
import Validation from "../middleware/auth_middleware.js";
import bodyparser from 'express';
//const VERSION = "v1"

const Route = (app) => {
    app.use(bodyparser.urlencoded({extended:true}));
    app.use(bodyparser.json());

    // app.use('/user', userRoter);
    // app.use('/groups', userRoter);

    app.post('/register',Middleware.JoiMiddleware, userServices.addUser);
    app.post('/login',Middleware.JoiMiddleware,userServices.login);
    app.get('/profile',Validation.authValidation,userServices.profile);
    app.put('/update',Middleware.JoiMiddleware,Validation.authValidation,userServices.update);
    app.delete('/delete',Validation.authValidation,userServices.delete);
    app.post("/upload",userServices.addFile);
    app.post("/quote",Validation.authValidation,Middleware.JoiMiddleware,userServices.addQuoteUser)
    app.get("/quotedata",Validation.authValidation,userServices.quoteAllDetails)
    app.get("/quotesingle",Validation.authValidation,userServices.quoteSingleDetail)
}

export default Route;