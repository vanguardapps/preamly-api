import mongoose from "mongoose";
import { DatabaseError } from "../utils/api-error";

const connectDB = async () => {
  if (mongoose.connection.readyState !== 1) {
    try {
      mongoose.connect(process.env.MONGO_API_CONN_STR as string)
        .catch(err => { throw err });
      mongoose.connection.on('error', err => { throw err });
      mongoose.connection.on('disconnected', err => { throw err });
      mongoose.set("strictQuery", false);
    } catch (err: any) {
      throw new DatabaseError(err);
    }
  }
};

export default connectDB;
