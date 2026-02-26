import mongoose from "mongoose";
const expenseShcema = mongoose.Schema({
    userId: {
        required: true,
        ref: "user",
        type: mongoose.Schema.Types.ObjectId,
    },
    amount: { required: true, type: Number },
    categoryId: {
        required: true,
        ref: "category",
        type: mongoose.Schema.Types.ObjectId,
    },
    date: Date,
});

export default mongoose.model("expense", expenseShcema);
