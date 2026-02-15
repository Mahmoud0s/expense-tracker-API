import express from "express"
import mongoose from "mongoose";
import "dotenv/config";
import dns from "dns";
import userRoute from "./routes/userRoutes.js";
import errorMiddleWare from "./middleWare/errorMiddleWare.js";
dns.setServers(["8.8.8.8"]);

mongoose.connect(
    `mongodb+srv://${process.env.UserNameDB}:${process.env.PasswordDB}@${process.env.ClusterDB}.kdtuexs.mongodb.net/`,
).then(()=>{
    console.log("conncted to DB")
});

const app = express()

app.use(express.json())
app.use("/user",userRoute)
app.get("/",(req,res,next)=>{
    res.send("hi")
})
app.use(errorMiddleWare)
app.listen(process.env.port,()=>{
    console.log(`listen to port ${process.env.port}`);
})