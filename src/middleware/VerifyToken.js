import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({
            "success": false,
            "message": "No token auth",
            "data": null,
        });
    };
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (err && err.name === "TokenExpiredError") {
            return res.status(403).json({
                "success": false,
                "message": "Expired token",
                "data": null,
            })
        }
        if (err && err.name === "JsonWebTokenError") {
            return res.status(403).json({
                "success": false,
                "message": "Invalid token",
                "data": null,
            });
        }
        next();
    })
}   