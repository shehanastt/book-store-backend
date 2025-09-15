import express from 'express';
import connectDB from "./DB/connectDB.js"
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from "./routes/authRoute.js"
import bookRoute from "./routes/bookRoute.js"
import userRoute from './routes/userRoute.js';


// configuration
dotenv.config()
const app = express();
const PORT = process.env.PORT || 8000;

// database connect
connectDB()
app.use('/uploads' ,express.static('uploads'))

app.use(express.json());

// middleware
app.use(cors());

// routes
app.use('/auth',authRoute);
app.use('/user',userRoute);
app.use('/books',bookRoute);




// GLOBAL ERROR HANDLER
app.use((error,req, res,next) => {
    const statusCode = typeof error.code === 'number' ? error.code : 500;
    res.status(statusCode).json({
        message: error.message || "An unknown error occurred",
    });
});

// start/listen server
app.listen(PORT, ()=> {
    console.log(`server running on port http://localhost:${PORT}`);
});