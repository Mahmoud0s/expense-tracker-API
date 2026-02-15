import mongoose from "mongoose";
import validator from "validator";
const UserSchema=mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        vaildate:[validator.isEmail,"enter vaild email"]
    },
    userName:{
        type:String,
        require:true,
        vaildate:[(value)=>validator.isLength(value,{min:6}),"user name must be at least 6 letters"]
    },
    password:{
        type:String,
        require:true,
        validate:[(value)=>validator.isLength(value,{min:8}),"password must be more than 8 letters"]
    }
});

export default mongoose.model("user",UserSchema)