import mongoose from "mongoose";

const dbConnection = async () => {
    const mongooseUrl = "mongodb://fundsverifier1:VBNH00TUX0X0jc6C@ac-o1kat8d-shard-00-00.zfnmndx.mongodb.net:27017,ac-o1kat8d-shard-00-01.zfnmndx.mongodb.net:27017,ac-o1kat8d-shard-00-02.zfnmndx.mongodb.net:27017/fundVerifier?ssl=true&authSource=admin&retryWrites=true&w=majority";
    
    try {
        await mongoose.connect(mongooseUrl);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB:", error);
        throw new Error("Could not connect to MongoDB server");
    }
}

export default dbConnection;
