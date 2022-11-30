//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
import express from 'express';
const app = express();
import mongoose from 'mongoose';
import Route from './Router/route.js';

import dotenv from "dotenv"
dotenv.config()

mongoose.connect(process.env.MONGODB).then(()=>{
    console.log('mongoose is connected')
}).catch((err)=>{
    console.log("cant connect to database",err)
})

Route(app)

app.listen(process.env.PORT)