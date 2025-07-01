import Book from "../models/books.js"
import HttpError from "../middlewares/httpError.js"
import { validationResult } from "express-validator";

export const listBooks = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  try {
    const { user_role, user_id } = req.userData;

    let filter = { is_deleted: false };

    if (user_role === "seller") {
      filter.seller = user_id;
    }

    const total = await Book.countDocuments(filter);

    const listedBooks = await Book.find(filter)
      .select("title image author price stock seller")
      .populate({
        path: "seller",
        select: "name",
      })
      .skip(skip)    
      .limit(limit);  

    res.status(200).json({
      status: true,
      message: "",
      data: listedBooks,
      total,
    });
  } catch (err) {
    return next(new HttpError("error fetching books", 500));
  }
};


// add a book
export const addBook = async (req,res,next) => {
    try{
        const errors = validationResult(req)
        const imagePath = req.file ? req.file.path : null

        if(!errors.isEmpty()){
            return next(new HttpError("Invalid inputs,please check again",422))
        } else {

            const {title, price, author} = req.body;
            const {user_id, user_role} = req.userData
    
            if( user_role !== "seller"){
                return next(new HttpError('You are not authorized!',401));
            } else {

                if (!imagePath) {
                    return next(new HttpError("Image is required", 422));
                } else {
                    const addedBook = await new Book({
                        title, 
                        price, 
                        author, 
                        image: imagePath, 
                        seller: user_id
                    }).save()
        
                    if(!addedBook){
                        return next(new HttpError('no books added',))
                    } else{
                        res.status(201).json({
                            status: true,
                            message: "Book Added",
                            data: ""
                        });
                    }
                }
            }
        }
    } catch (err) {
        console.error("Book creation error:", err); 
        return next(new HttpError('failed adding book',500));
    }
};

// view a book
export const getBook = async (req, res, next)=> {
    try{
        const {id} = req.params
        const {user_id, user_role} = req.userData

        let viewBook

        if(user_role === "seller") {
            viewBook = await Book.findOne({_id: id, seller: user_id, is_deleted: false})
            .select("title image author price stock seller")
            .populate({
                path: "seller",
                select: "name"
            });
        } else {
            viewBook = await Book.findOne({_id: id, is_deleted: false})
            .select("title image author price stock seller")
            .populate({
                path: "seller",
                select: "name"
            });
        }

        if(!viewBook){
            return next (new HttpError("Book not found",404));
        } else {
            res.status(200).json({
                status: true,
                message: "",
                data: viewBook
            });
        }
    } catch {
        return next (new HttpError('error fetching product',500));
    }
};

// delete a book
export const deleteBook = async(req,res,next) => {
    try{
        console.log("helloooo")
        const {id} = req.params
        const {user_id, user_role} = req.userData

        if(user_role !== "seller") {
            return next (new HttpError('only sellers can delete',403));
        } else {

            console.log(user_id,user_role,"req user data")
    
            const del = await Book.findOneAndUpdate(
                {_id: id, seller: user_id, is_deleted: false},
                {is_deleted: true},
                {new: true});
    
                console.log(del,"del")
    
            if(!del){
                return next(new HttpError('Book not found',404));
            } else {
                res.status(200).json({
                    status: true,
                    message: "Product deleted successfully",
                    data:""
                })
            }
        }
    } catch (err){
        return next(new HttpError("Error deleting product"));
    }
};


// edit book
export const editBook = async(req,res,next) =>{
    try{
        const errors = validationResult(req)
        const imagePath = req.file ? req.file.path : null

        if (!errors.isEmpty()) {
            return next(new HttpError("Invalid input , please try again"));
        } else {

            const {id} = req.params
            const {user_id, user_role} = req.userData
            const {title,price,author,image,stock,} = req.body
    
            if(user_role !== "seller") {
                return next (new HttpError('only sellers can edit',403));
            } else{

                // if(!imagePath){
                //     return next(new HttpError("Image is required",422));
                // } else{

                    const updatedBook = {
                        title,
                        price,
                        author,
                        stock
                    }

                    if(imagePath){
                        updatedBook.image = imagePath
                    }

                    const editedBook = await Book.findOneAndUpdate(
                        {_id: id, seller: user_id, is_deleted: false},
                        updatedBook,
                        {new: true});
        
                        if(!editedBook){
                            return next(new HttpError(' book not found ',404));
                        } else {
                            res.status(200).json({
                                status: true,
                                message: "Book updated",
                                data: ""
                            })
                        }
                // }
    
            }
        }
    } catch (err){
        console.error("Edit Book Error:", err);
        return next(new HttpError("Error occurred"));
    }
};