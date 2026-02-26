import express from "express";
import verifyToken from "../middleWare/verifyToken.js"
import allowTo from "../middleWare/allowTo.js"
import {
    createExpense,
    getAllExpenses,
    updateSingleExpense,
    deleteSingleExpense,
    allExpensesRelated,
} from "../controllers/expenseController.js";
const expenseRoutes = express.Router();
expenseRoutes.get("/all",verifyToken,allowTo(["admin","moderator"]), getAllExpenses);
expenseRoutes
    .route("/")
    .post(verifyToken,allowTo(["admin", "moderator"]), createExpense)
    .get(
        verifyToken,
        allExpensesRelated,
    ); // get all realeted  current user

expenseRoutes
    .route("/:expenseId")
    .patch(verifyToken, allowTo(["admin", "moderator"]), updateSingleExpense)
    .delete(verifyToken, allowTo(["admin", "superAdmin"]), deleteSingleExpense);

export default expenseRoutes;
