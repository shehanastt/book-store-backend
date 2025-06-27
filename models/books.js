import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        // default: null
        required: true
    },
    author: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 1
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps : true
    }
);

const Book = mongoose.model('Book',bookSchema);

export default Book