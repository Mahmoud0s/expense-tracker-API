import userModel from "../model/userModel.js";
import generateToken from "../utilis/generateTokens.js";
import bcrypt from "bcrypt";
const createUser = async (req, res, next) => {
    try {
        const newUser = await userModel.create(req.body);
        res.status(201).json({ state: "success", data: newUser });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};
const login = async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const userFound = await userModel.findOne({ userName });
        if (!userFound)
            return res
                .status(404)
                .send({ state: "faild", massage: "this user not exist " });

        const checkUser = await bcrypt.compare(password, userFound.password);
        if (!checkUser)
            return res
                .status(400)
                .send({ state: "faild", massage: "wrong password" });
        const token = generateToken(
            {
                userName: userFound.userName,
                role: userFound.role,
                email: userFound.email,
                id: userFound._id,
            },
            "24h",
        );
        return res.status(200).send({ state: "success", data: token });
    } catch (error) {
        next(error);
    }
};
const getAllUsers = async (req, res, next) => {
    try {
        const pageNum = req.query.page || 1;
        const limit = 5;
        const skip = (pageNum - 1) * limit;
        const users = await userModel
            .find({}, { password: false, __v: false })
            .skip(skip)
            .limit(limit);
        res.send({ state: "success", data: users });
    } catch (error) {
        next(error);
    }
};
const getSingleUser = async (req, res, next) => {
    try {
        const foundUser = await userModel.findOne(
            { _id: req.params.id },
            { userName: 1, role: 1, email: 1, _id: 0 },
        );
        res.status(200).send({ state: "success", data: foundUser });
    } catch (_) {
        const error = new Error("not Found this user ");
        error.statusCode = 404;
        next(error);
    }
};
const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const deleteUser = await userModel.deleteOne({ _id: userId });
        res.status(200).send({ state: "success", data: deleteUser });
    } catch (error) {
        next(error);
    }
};
const deleteAllUser = async (req, res) => {
    const users = await userModel.deleteMany();
    return res.status(200).send({ state: "success", data: users });
};
const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const updateUser = await userModel.findOneAndUpdate(
            { _id: userId },
            req.body,
            { runValidators: true, returnDocument: "after" },
        );
        res.status(200).send({ state: "success", data: updateUser });
    } catch (error) {
        next(error);
    }
};
export {
    createUser,
    login,
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateUser,
    deleteAllUser,
};
