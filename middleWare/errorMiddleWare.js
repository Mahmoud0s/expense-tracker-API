export default (err,req,res,next)=>{
    res.status(err.statusCode || 500).send({
        state: "error",
        msg: err.message,
    });
}