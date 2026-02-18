import categoryModel from "../model/categoryModel.js";
const getSingleCategory = async (req, res, next) => {
    try {
        const categoryData = await categoryModel.findById(req.params.catId);
        if (!categoryData)
            res.status(404).send({
                state: "faild",
                message: "this categor not exist ",
            });
        return res.status(200).send({ state: "success", data: categoryData });
    } catch (error) {
        next(error);
    }
};
const deleteSingleCategory = async (req, res, next) => {
    try {
        const deletedCategory = await categoryModel.deleteOne({
            _id: req.params.catId,
        });
        if (!deletedCategory)
            res.status(404).send({
                state: "faild",
                message: "this categor not exist ",
            });
        res.status(200).send({ state: "success", data: deletedCategory });
    } catch (error) {
        next(error);
    }
};
const updateSingleCategory = async (req, res, next) => {
    try {
        const updatedCategory = await categoryModel.findOneAndUpdate(
            { _id: req.params.catId },
            req.body,
            { returnDocument: "after" },
        );
        if (!updatedCategory)
            return res
                .status(404)
                .send({ state: "failed", message: "this category not exist" });
        res.status(200).send({ state: "success", data: updatedCategory });
    } catch (error) {
        next(error);
    }
};
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await categoryModel.find({});
        res.status(200).send({ state: "success", data: categories });
    } catch (error) {
        next(error);
    }
};
const deleteAllCategories = async (req, res, next) => {
    try {
        const deletedInfo = await categoryModel.deleteMany({});
        res.status(200).send({ state: "success", data: deletedInfo });
    } catch (error) {
        next(error);
    }
};
const createCategory = async (req, res, next) => {
    try {
        const category = await categoryModel.create(req.body);
        res.status(201).send({ state: "success", data: category });
    } catch (error) {
        next(error);
    }
};

export {
    getSingleCategory,
    deleteSingleCategory,
    updateSingleCategory,
    getAllCategories,
    deleteAllCategories,
    createCategory,
};
