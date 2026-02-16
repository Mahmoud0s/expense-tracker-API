import jwt  from "jsonwebtoken";
export default (payload,expDate="1h")=>{
    return jwt.sign(payload, process.env.privateKey, { expiresIn: expDate });
}