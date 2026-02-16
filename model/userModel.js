import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "enter vaild email"],
    },
    userName: {
        unique: true,
        type: String,
        required: true,
        validate: [
            (value) => validator.isLength(value, { min: 6 }),
            "user name must be at least 6 letters",
        ],
    },
    password: {
        type: String,
        required: true,
        validate: [
            (value) => validator.isLength(value, { min: 8 }),
            "password must be more than 8 letters",
        ],
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "moderator", "admin", "superAdmin"],
        default: "user",
    },
});
UserSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
});
UserSchema.pre("deleteOne", async function () {
    const checkDeletedUser = await this.model.findOne({
        _id: this.getFilter(),
    });
    if (["admin", "superAdmin"].includes(checkDeletedUser.role))
        throw new Error("cannot delete Admin or superAdmin 😑");
});
UserSchema.pre("findOneAndUpdate", async function () { // will change soon
    // const updatedData = this.getUpdate(); 
    // // if(updatedData.password)
    // //     updatedData.password = await bcrypt.hash(updatedData.password, await bcrypt.genSalt(10));
});
export default mongoose.model("user", UserSchema);
