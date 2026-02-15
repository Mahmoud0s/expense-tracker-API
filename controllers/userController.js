import userModel from "../model/userModel.js"
const createUser= async (req,res,next)=>{
    try{
        const newUser=await userModel.create(req.body)
        res.status(201).json({ state: "success", data: newUser });
    }catch(err){
        const error = new Error(err)
        next(error)
    }
}

export {createUser}