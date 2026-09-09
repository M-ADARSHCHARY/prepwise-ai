import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { AppError } from "../middleware/AppError.js";

const createToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );
};

// REGISTER
export const registerUser = async (req, res, next) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new AppError("All fields are required.",400);
        }

        const existingUser = await User.findOne({ email });

        if(existingUser){
            throw new AppError("Email already registered.",400);
        }

        const passwordHash = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            passwordHash
        });

        const token = createToken(user._id);

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"lax",
            maxAge:7*24*60*60*1000
        });

        res.status(201).json({
            success:true,
            data:{
                _id:user._id,
                name:user.name,
                email:user.email
            }
        });

    } catch(err){
        next(err);
    }
};

// LOGIN
export const loginUser = async(req,res,next)=>{

    try{
        
        const {email,password}=req.body;
        // console.log("body:",email,password);

        if(!email || !password){
            throw new AppError("Email and password required.",400);
        }

        const user=await User.findOne({email}).select("+passwordHash");

        if(!user){
            throw new AppError("Invalid credentials.",401);
        }

        const isMatch=await bcrypt.compare(
            password,
            user.passwordHash
        );

        if(!isMatch){
            throw new AppError("Invalid credentials.",401);
        }

        const token=createToken(user._id);

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:"lax",
            maxAge:7*24*60*60*1000
        });

        res.status(200).json({
            success:true,
            data:{
                _id:user._id,
                name:user.name,
                email:user.email
            }
        });

    }catch(err){
        next(err);
    }

};

// LOGOUT
export const logoutUser=(req,res)=>{

    res.clearCookie("token");

    res.json({
        success:true,
        message:"Logged out successfully."
    });

};

// CURRENT USER
export const getCurrentUser=async(req,res,next)=>{

    try{

        const user=await User.findById(req.user._id);

        res.json({
            success:true,
            data:user
        });

    }catch(err){
        next(err);
    }

};