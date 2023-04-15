import mongoose from "mongoose";
import { DatabaseError } from "../utils/api-error";

const connectDB = async () => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGODB_CONN_STR as string);
      mongoose.set("strictQuery", false);
    } catch (err: any) {
      throw new DatabaseError(err);
    }
  }
};

export default connectDB;
