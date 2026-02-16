import express from "express";
import {
    createUser,
    login,
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateUser,
    deleteAllUser,
} from "../controllers/userController.js";
import verifyToken from "../middleWare/verifyToken.js";
import allowTo from "../middleWare/allowTo.js";
const userRoute = express.Router();

userRoute.post("/register", createUser);
userRoute.post("/login", login);

userRoute
    .route("/:id")
    .get(verifyToken, allowTo(["admin", "moderator", "user"]), getSingleUser)
    .delete(verifyToken, allowTo(["admin", "moderator"]), deleteUser)
    .patch(verifyToken, allowTo(["admin", "moderator"]), updateUser);
userRoute
    .route("/")
    .get(verifyToken, allowTo(["admin", "moderator", "user"]), getAllUsers)
    .delete(verifyToken, allowTo(["superAdmin"]), deleteAllUser);

export default userRoute;
