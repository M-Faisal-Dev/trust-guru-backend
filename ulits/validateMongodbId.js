import mongoose from "mongoose";
const validateMongoId = (id)=>{
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if(!isValid) throw new Error("this id is not a valid or not found")
}
export default validateMongoId;