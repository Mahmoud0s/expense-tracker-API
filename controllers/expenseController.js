import mongoose from "mongoose";
import expenseModel from "../model/expenseModel.js";
const createExpense = async (req, res, next) => {
    try {
        const expense = await expenseModel.create(req.body);
        res.status(201).send({ state: "success", data: expense });
    } catch (error) {
        next(error);
    }
};
const getAllExpenses = async (req, res, next) => {
    try {
        let filter = {};
        if (req.query.from && req.query.to)
            filter.date = {
                $gte: new Date(req.query.from),
                $lte: new Date(req.query.to),
            };
        if (req.query.category)
            filter["categoryData.categoryName"] = req.query.category;
        if (req.query.minAmount && req.query.maxAmount)
            filter.amount = {
                $lte: Number(req.query.maxAmount),
                $gte: Number(req.query.minAmount),
            };
        if (req.query.type) filter["categoryData.type"] = req.query.type.trim();

        const pageNumber = req.query.page;
        const limit = 5;
        const skip = (pageNumber - 1) * limit;
        let pipeLine = [
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDate",
                },
            },
            { $unwind: { path: "$userDate" } },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            { $unwind: { path: "$categoryData" } },
            { $match: filter },
        ];

        if (req.query.sortName)
            pipeLine.push({
                $sort: {
                    [req.query.sortName]: req.query.sortType != "ASC" ? -1 : 1,
                },
            });

        pipeLine.push(
            { $skip: skip || 0 },
            {
                $project: {
                    amount: true,
                    _id: true,
                    date: true,
                    "userDate.name": true,
                    "userDate.userName": true,
                    "userDate.role": true,
                    "categoryData.categoryName": true,
                    "categoryData.type": true,
                },
            },
        );

        const allData = await expenseModel.aggregate(pipeLine);

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
        console.log(updatedData);
        if (updatedData == null)
            res.status(400).send({ state: "failed", message: "invaild Id" });
        res.status(200).send({ state: "success", data: updatedData });
    } catch (error) {
        next(error);
    }
};
const deleteSingleExpense = async (req, res, next) => {
    try {
        const deletedInfo = await expenseModel.deleteOne({
            _id: req.params.expenseId,
        });
        res.status(200).send({ state: "success", data: deletedInfo });
    } catch (error) {
        next(error);
    }
};
const allExpensesRelated = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const expensesData = await expenseModel
            .find({ userId }, { userId: false, __v: false })
            .populate("categoryId")
            .sort({ amount: -1 });
        res.send({ state: "success", data: expensesData });
    } catch (error) {
        next(error);
    }
};
const expenseSummary = async (req, res, next) => {
    try {
        let filter = {};
        if (req.query.from && req.query.to)
            filter.date = {
                $gte: new Date(req.query.from),
                $lte: new Date(req.query.to),
            };
        const pipeLine = [
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user.id),
                    ...filter,
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            { $unwind: { path: "$categoryData" } },
            {
                $group: {
                    _id: "$categoryData.categoryName",
                    type: { $first: "$categoryData.type" },
                    total: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: null,
                    category: {
                        $push: {
                            _id: "$_id",
                            total: "$total",
                            count: "$count",
                            type: "$type",
                        },
                    },
                    totalIncome: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "income"] }, "$total", 0],
                        },
                    },
                    totalExpense: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "expense"] }, "$total", 0],
                        },
                    },
                },
            },
            {
                $addFields: {
                    net: { $subtract: ["$totalIncome", "$totalExpense"] },
                    mostCategoryUsed: { $max: "$category.count" },
                    mostCategoryIncome: {
                        $first: {
                            $sortArray: {
                                input: {
                                    $filter: {
                                        input: "$category",
                                        as: "item",
                                        cond: {
                                            $eq: ["$$item.type", "income"],
                                        },
                                    },
                                },
                                sortBy: { count: -1 },
                            },
                        },
                    },
                    mostCategoryExpense: {
                        $first: {
                            $sortArray: {
                                input: {
                                    $filter: {
                                        input: "$category",
                                        as: "item",
                                        cond: {
                                            $eq: ["$$item.type", "expense"],
                                        },
                                    },
                                },
                                sortBy: { count: -1 },
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    "mostCategoryIncome.type": 0,
                    "mostCategoryExpense.type": 0,
                },
            },
        ];
        const getData = await expenseModel.aggregate(pipeLine);
        res.status(200).send({ state: "success", data: getData });
        // const getAllExpenseDetails = await expenseModel
        //     .find(
        //         { userId: req.user.id, ...filter },
        //         { userId: false, _id: false, __v: false },
        //     )
        //     .populate("categoryId");
        // let summary = {
        //     userName: req.user.name,
        //     income: 0,
        //     expense: 0,
        //     total: 0,
        //     mostCategoryIncome: { name: "", count: 0 },
        //     mostCategoryExpense: { name: "", count: 0 },
        //     expensesByCategory: [],
        // };
        // getAllExpenseDetails.forEach((el) => {
        //     console.log(el);
        //     const extistCat = summary.expensesByCategory.filter(
        //         (val) => val.category == el.categoryId.categoryName,
        //     );
        //     if (extistCat.length == 0)
        //         summary.expensesByCategory.push({
        //             category: el.categoryId.categoryName,
        //             total: el.amount,
        //         });
        //     else {
        //         summary.expensesByCategory.forEach((element) => {
        //             if (element.category == el.categoryId.categoryName)
        //                 el.categoryId.type == "expense"
        //                     ? (element.total -= el.amount)
        //                     : (element.total += el.amount);
        //         });
        //     }

        //     if (someDetails[el.categoryId.categoryName])
        //         someDetails[el.categoryId.categoryName].count++;
        //     else {
        //         someDetails[el.categoryId.categoryName] = {
        //             count: 1,
        //             type: el.categoryId.type,
        //         };
        //     }
        //     if (el.categoryId.type == "income") summary.income += el.amount;
        //     else summary.expense += el.amount;

        //     if (
        //         el.categoryId.type == "income" &&
        //         summary.mostCategoryIncome.count <
        //             someDetails[el.categoryId.categoryName].count
        //     ) {
        //         summary.mostCategoryIncome.name = el.categoryId.categoryName;
        //         summary.mostCategoryIncome.count =
        //             someDetails[el.categoryId.categoryName].count;
        //     }
        //     if (
        //         el.categoryId.type == "expense" &&
        //         summary.mostCategoryExpense.count <
        //             someDetails[el.categoryId.categoryName].count
        //     ) {
        //         summary.mostCategoryExpense.name = el.categoryId.categoryName;
        //         summary.mostCategoryExpense.count =
        //             someDetails[el.categoryId.categoryName].count;
        //     }
        // });
        // summary.total = summary.income - summary.expense;
        // res.status(201).send({ state: "success", data: summary });
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
    expenseSummary,
};
