import mongoose from 'mongoose';
import { DatabaseError } from './api-error.js';

const connectDB = async () => {
    if (mongoose.connection.readyState !== 1) {
        try {
            console.log('test here');
            await mongoose.connect(process.env.MONGODB_CONN_STR);
            mongoose.set("strictQuery", false);
        }
        catch (err) {
            throw new DatabaseError(err);
        }
    }
};

export { connectDB as default };
//# sourceMappingURL=connect-db.js.map
