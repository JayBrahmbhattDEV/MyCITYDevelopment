const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");

const registration = async (req, res) => {
    const { name, email, number } = req.body;
    try {
        const user = await User.create({ name, email, phoneNumber: number });
        res.status(201).json({
            success: true,
            data: { message: "Registration Successfully done." },
        });
    } catch (err) {
        res.status(500).json({ success: false, err });
    }
};

const login = async (req, res) => {
    const { loginVal } = req.body;

    try {
        const userExist = await User.findOne({
            $or: [{ email: loginVal }, { phoneNumber: loginVal }],
        });
        const user = await User.findById({ _id: userExist._id });
        if (user && userExist) {
            var token = jwt.sign({ user }, process.env.JWT_SECRET);
            res.status(201).json({ success: true, data: { user, token } });
        } else {
            res.status(500).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Invalid credentials" });
    }
};

module.exports = {
    registration,
    login,
};
