import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MOngoDB connected successfully');
    } catch (err) {
        console.log('MongoDB connection failed', err.message);
    }
};

export default connectDB