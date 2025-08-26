import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('MONGODB_URI is not defined in the environment variables');
      process.exit(1);
    }
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error instanceof Error ? error.message : String(error));
    // Exit so auth/register/login won't run without a database
    process.exit(1);
  }
};

export default connectDB;
