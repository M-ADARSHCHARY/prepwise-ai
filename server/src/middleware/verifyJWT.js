import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { AppError } from "./AppError.js";

export const verifyJWT=async(req,res,next)=>{

    try{

        const token=req.cookies.token;

        // console.log("Token from cookies:", token); // Debugging line

        if(!token){
            throw new AppError("Unauthorized.",401);
        }

        const decoded=jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user=await User.findById(decoded.id);

        if(!user){
            throw new AppError("User not found.",401);
        }

        req.user=user;

        next();

    }catch(err){
        next(err);
    }

};