import mongoose from "mongoose";
const categorySchema = mongoose.Schema({
    categoryName: { type: String, required: true, unique: true },
    type: { type: String, enum: ["income", "expense"], required: true },
});
export default mongoose.model("category", categorySchema);
