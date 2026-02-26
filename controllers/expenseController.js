import expenseModel from "../model/expenseModel.js";
const createExpense = async (req, res, next) => {
    try {
        const expense = await expenseModel.create(req.body);
        console.log(expense);
        res.status(201).send({ state: "success", data: expense });
    } catch (error) {
        next(error);
    }
};
const getAllExpenses = async (req, res, next) => {
    try {
        const pageNumber = req.query.page;
        const limit = 5;
        const skip = (pageNumber - 1) * limit;
        const allData = await expenseModel
            .find({}, { __v: false })
            .skip(skip)
            .limit(limit)
            .populate("userId", { name: true, role: true })
            .populate("categoryId", "categoryName type");

        res.status(200).send({ state: "success", data: allData });
    } catch (error) {
        next(error);
    }
};
const updateSingleExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.expenseId;
        const updatedData = await expenseModel.findOneAndUpdate(
            { _id: expenseId },
            req.body,
            { returnDocument: "after" },
        );
        console.log(updatedData)
        if(updatedData==null)
            res.status(400).send({ state: "failed", message: "invaild Id" });
        res.status(200).send({ state: "success", data: updatedData });
    } catch (error) {
        next(error);
    }
};
const deleteSingleExpense = async (req, res, next) => {
    try {
        const deletedInfo = await expenseModel.deleteOne({_id:req.params.expenseId})
        res.status(200).send({state:"success",data:deletedInfo})
    } catch (error) {
        next(error);
    }
};
const allExpensesRelated = async (req, res, next) => {
    try {
    const userId=req.user.id;
    console.log(userId);
    const expensesData= await expenseModel.find({userId},{userId:false,__v:false}).populate("categoryId").sort({amount:-1})
    res.send({state:"success",data:expensesData})
    } catch (error) {
        next(error);
    }
};
export {
    createExpense,
    getAllExpenses,
    updateSingleExpense,
    deleteSingleExpense,
    allExpensesRelated,
};
