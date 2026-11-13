import jwt from 'jsonwebtoken';
import {User,AuditLog} from '../models/index.js';
export async function authenticate(req,res,next){
 try{const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');if(!token) return res.status(401).json({message:'Authentication required'});const payload=jwt.verify(token,process.env.JWT_SECRET);const user=await User.findById(payload.sub);if(!user||!user.active)return res.status(401).json({message:'Session is invalid'});req.user=user;next();}catch{return res.status(401).json({message:'Invalid or expired session'});}
}
export const allowRoles=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({message:'Your role cannot perform this action.'});
export async function audit(req,action,resource,resourceId='',details={}){try{await AuditLog.create({actor:req.user?._id,action,resource,resourceId:String(resourceId||''),details,ip:req.ip});}catch(e){console.error('Audit write failed:',e.message);}}
export function errorHandler(err,req,res,next){console.error(err);if(err.name==='ValidationError')return res.status(400).json({message:'Validation failed',errors:Object.values(err.errors).map(x=>x.message)});if(err.code===11000)return res.status(409).json({message:'That username or email is already in use.'});res.status(err.status||500).json({message:err.message||'Internal server error'});}
