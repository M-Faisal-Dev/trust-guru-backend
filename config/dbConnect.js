import mongoose from "mongoose";

const dbConnection = async () => {
    const mongooseUrl = "mongodb://admin:rayKl9WcXLIVtqM1@ac-n999mho-shard-00-00.0z5atfb.mongodb.net:27017,ac-n999mho-shard-00-01.0z5atfb.mongodb.net:27017,ac-n999mho-shard-00-02.0z5atfb.mongodb.net:27017/trust_guru?ssl=true&authSource=admin&retryWrites=true&w=majority";
   
    try {
        await mongoose.connect(mongooseUrl);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB:", error);
        throw new Error("Could not connect to MongoDB server");
    }
}

export default dbConnection;
