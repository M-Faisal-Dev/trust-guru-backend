import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
});

const Category = mongoose.model("BlogCategory", blogCategorySchema);

export default Category;
