import express from "express";
import allowTo from "../middleWare/allowTo.js";
import verifyToken from "../middleWare/verifyToken.js";
import {
    getSingleCategory,
    deleteSingleCategory,
    updateSingleCategory,
    getAllCategories,
    deleteAllCategories,
    createCategory,
} from "../controllers/categoryController.js";
const categoryRoutes = express.Router();
categoryRoutes
    .route("/:catId")
    .get(verifyToken, allowTo(["moderator", "admin"]), getSingleCategory)
    .delete(verifyToken, allowTo(["moderator", "admin"]), deleteSingleCategory)
    .patch(verifyToken, allowTo(["moderator", "admin"]), updateSingleCategory);
categoryRoutes
    .route("/")
    .get(verifyToken, allowTo(["moderator", "admin"]), getAllCategories)
    .delete(verifyToken, allowTo(["superAdmin", "admin"]), deleteAllCategories)
    .post(verifyToken, allowTo(["moderator", "admin"]), createCategory);

export default categoryRoutes;
