import User from "../models/users.js"
import HttpError from "../middlewares/httpError.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import { validationResult } from "express-validator";


// register
export const registerUser = async (req, res, next)=> {
    try{
        const errors = validationResult(req);
        
        console.log('Validation errors:', errors);
        
        if(!errors.isEmpty()){
            return next(new HttpError("Invalid inputs passed, please check and retry", 422))
        } else {
            const {name , email ,role ,password} = req.body

            const imagePath = req.file?.path;

            if(!imagePath){
                return next(new HttpError("Please upload your profile picture",422));
            } else{
                const userExists = await User.findOne({email})
                 
                if(userExists){
                    return next(new HttpError("User already exists",400));
                } else {
                    const hashedPassword = await bcrypt.hash(password,12)
        
                    const user = await new User({
                        name,
                        email,
                        role,
                        password: hashedPassword,
                        image: imagePath
                    }).save();
        
                    if(!user){
                        return next(new HttpError("Registration failed", 400));
                    } else {
                        const token = jwt.sign(
                        { id: user._id, role: user.role },
                        process.env.SECRET_KEY,
                        { expiresIn: process.env.JWT_TOKEN_EXPIRY}
                    );
                        res.status(201).json({
                            status: true,
                            message:"Registered successfully",
                            token,
                            data: {
                                _id: user.id,
                                email: user.email,
                                role: user.role
                            }
                        })
                    }
        
                }
            }
        }

    } catch (err){
        return next(new HttpError("process failed",500));
    }
};


// login
export const loginUser = async (req,res,next) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return next(new HttpError("Invalid inputs,check again",422));
        } else {
            const {email , password} = req.body
    
            const user = await User.findOne({email});
    
            if(!user){
                return next(new HttpError("user doesn't exist",404));
            } else {
                const isMatch = await bcrypt.compare(password, user.password);
    
                if(!isMatch){
                    return next(new HttpError('invalid credentials',403));
                } else {
                    //jwt generate
                    const token = jwt.sign(
                        { id: user._id, role: user.role },
                        process.env.SECRET_KEY,
                        { expiresIn: process.env.JWT_TOKEN_EXPIRY}
                    );
    
                    if(!token){
                        return next(new HttpError('Token generation failed',403));
                    } else {
                        res.status(200).json({
                            status: true,
                            message: "Login successful",
                            token,
                            data: {
                                _id: user.id,
                                email: user.email,
                                role: user.role
                            }
                        })
                    }
                }
            }
        }
    } catch (err){
        return next(new HttpError("Login failed",500));
    }
};