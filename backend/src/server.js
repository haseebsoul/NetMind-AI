import 'dotenv/config'; import express from 'express'; import cors from 'cors'; import helmet from 'helmet'; import rateLimit from 'express-rate-limit';
import {connectDB} from './config/db.js'; import api from './routes/api.js'; import {errorHandler} from './middleware/security.js';
const app=express(); app.set('trust proxy',1); app.use(helmet()); app.use(cors({origin:(process.env.CORS_ORIGINS||'http://localhost:5173').split(',').map(x=>x.trim()),credentials:true})); app.use(express.json({limit:'1mb'})); app.use('/api/auth',rateLimit({windowMs:15*60*1000,limit:30,standardHeaders:true,legacyHeaders:false})); app.use('/api',api); app.use(errorHandler);
const port=Number(process.env.PORT||8000); await connectDB(); app.listen(port,'0.0.0.0',()=>console.log('NetMind API listening on',port));
