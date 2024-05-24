import mongoose from "mongoose";

const ProdCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
});

const Category = mongoose.model("Prodcategory", ProdCategorySchema);

export default Category;
