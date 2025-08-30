const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "user")
        return res.status(403).json({ error: "Forbidden: User access only" });

        const user = await User.findById(decoded.userId);
        if (!user)
        return res.status(401).json({ error: "User not found" });

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = userMiddleware;