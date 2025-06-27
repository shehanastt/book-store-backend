import { Router } from 'express';
import { check } from 'express-validator';
import { loginUser, registerUser } from '../controllers/authController.js';
import upload from '../middlewares/upload.js';

const router = Router();

router.post('/register',upload.single("image"), [
    check("name").notEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Email is required"),
    check("role").notEmpty().withMessage("Role is required"),
    check("password").notEmpty().withMessage("Password is required"),
    check("image").custom((value,{req})=>{
        if(!req.file){
            throw new Error("Image is required")
        } return true;
    })
] ,registerUser);

router.post('/login', [
    check("email").notEmpty().withMessage("Email required"),
    check("password").notEmpty().withMessage("Enter your password")
], loginUser);

export default router;