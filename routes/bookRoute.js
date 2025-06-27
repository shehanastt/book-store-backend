import express from 'express';
import { addBook, deleteBook, editBook, getBook, listBooks } from '../controllers/bookController.js';
import userAuthCheck from '../middlewares/authCheck.js';
import { check } from 'express-validator';
import upload from '../middlewares/upload.js';

const router = express.Router()
router.use(userAuthCheck)

router.get('/list',listBooks);

router.post('/add', upload.single("image"),[
    check("title").notEmpty().withMessage("Enter the title of book"),
    check("author").notEmpty().withMessage("Enter the author of book"),
    check("price").notEmpty().withMessage("Enter the price of book"),
    check("image").custom((value, { req }) => {
            if (!req.file) {
                throw new Error("Image file is required");
            }
            return true;
        }),
],addBook);

router.get('/:id',getBook)
router.patch('/:id',deleteBook);

router.patch('/edit/:id', upload.single("image"),[
    check("title").optional().notEmpty().withMessage("Title name required"),
    check("author").optional().notEmpty().withMessage("author name required"),
    check("price").optional().notEmpty().withMessage("price required"),
    // check("image").custom((value,{req}) => {
    //     if(!req.file){
    //         throw new Error("Image file is required");
    //     } return true;
    // })
],editBook);

export default router;