const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token === null) return res.sendStatus(401);

    if (req?.body?.role === "admin") {
        req.isAdmin = true
    } else {
        req.isAdmin = false
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err)
            return res
                .status(403)
                .json({ success: false, message: "unauthorized user" });

        if (user) {
            const resUser = await User.findById({ _id: user.jwtUser.id })
            req.user = resUser;
        }
        next();
    });
};

module.exports = { authenticateToken };
