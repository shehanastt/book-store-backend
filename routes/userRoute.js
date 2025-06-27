import { Router } from 'express'
import userAuthCheck from '../middlewares/authCheck.js'
import { editProfile, viewProfile } from '../controllers/userController.js'
import { check } from 'express-validator'
import upload from '../middlewares/upload.js'

const router = Router()
router.use(userAuthCheck)

router.get('/viewprofile', viewProfile);

router.patch('/edit/editprofile', upload.single("image"),[
    check("name").optional().notEmpty().withMessage("Name required"),
    check("email").optional().isEmail().withMessage("email required"),
    check("password").optional().isLength({ min: 6 }).withMessage("password required"),
    check("image").optional()
    // .custom((value,{req})=>{
    //     if(!req.file){
    //         throw new Error("Image is required sir");
    //     } return true;
    // })
],editProfile);

export default router