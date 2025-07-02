import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.set("strictQuery", true);

const connection = async () => {
  try {

    console.log("MongoDB URL:", process.env.MONGODB_URL_PRODUCTION);

    const conn = await mongoose.connect(process.env.MONGODB_URL_PRODUCTION);
    console.log(`Database is connected on ${conn.connection.host}`);

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connection;