import jwt from "jsonwebtoken";
export default async (req, res, next) => {
    try {
        const authHeader =
            req.headers["authorization"] || req.headers["Authorization"];
        if (!authHeader)
            return res
                .status(401)
                .send({ state: "error", message: "need a token" });

        const token = authHeader.split(" ")[1];
        if (!token)
            return res
                .status(401)
                .send({ state: "error", message: "need a token" });

        const decoded = jwt.verify(token, process.env.privateKey);

        req.user = decoded;
        next();
    } catch (err) {
        if (err.name == "JsonWebTokenError")
            return res
                .status(401)
                .send({ state: "error", msg: "expire token" });
        else
            return res
                .status(401)
                .send({ state: "error", msg: "invalid token" });
    }
};
