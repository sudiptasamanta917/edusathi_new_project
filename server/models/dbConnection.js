import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = `${process.env.MONGO_CONNECTION_STRING_LOCAL}EdusathiCreator`;
console.log(mongoURI);
const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoURI)
        console.log('MongoDB Connected Successfully');
    } catch(e) {
        console.error("MongoDB connection error:", e.message);
        process.exit(1);
    }
}

export default connectDB;

