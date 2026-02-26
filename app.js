import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import errorMiddleWare from "./middleWare/errorMiddleWare.js";
import dns from "dns";
import "dotenv/config";

dns.setServers(["8.8.8.8"]);

mongoose
    .connect(
        `mongodb+srv://${process.env.UserNameDB}:${process.env.PasswordDB}@${process.env.ClusterDB}.kdtuexs.mongodb.net/`,
        { autoIndex: true },
    )
    .then(() => {
        console.log("conncted to DB");
    });

const app = express();
app.use(express.json());

app.use("/user", userRoute);
app.use("/category", categoryRoutes);
app.use("/expense", expenseRoutes);
app.all("/*splat", (req, res, next) => {
    res.status(404).send({
        state: "error",
        message: `there is no url called:${req.url}`,
    });
});

app.use(errorMiddleWare);
app.listen(process.env.port, () => {
    console.log(`listen to port ${process.env.port}`);
});
