import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        enum:["buyer","seller"],
        default: "buyer"
    },
    image:{
        type: String,
        default: null,
        // required: true
    },
    password: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

const User = mongoose.model('User',userSchema);

export default User;