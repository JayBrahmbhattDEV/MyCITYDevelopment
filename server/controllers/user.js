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
            const jwtUser = { id: user._id }
            var token = jwt.sign({ jwtUser }, process.env.JWT_SECRET);
            res.status(201).json({ success: true, data: { user, token } });
        } else {
            res.status(500).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Invalid credentials" });
    }
};

const getProfile = async (req, res) => {
    try {
        if (req.user) {
            res.status(200).json({ success: true, data: req.user })
        } else {
            res.status(404).json({ success: false, message: "User not found" })
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err });
    }
}

const updateProfile = async (req, res, next) => {


    const id = req.user._id
    var validEmail = true;
    var validPhoneNumber = true;

    try {
        if (req.user) {
            if (req.body.email !== req.user.email) {
                const userExistWithEmail = await User.findOne({ email: req.body.email })
                userExistWithEmail ? validEmail = false : validEmail = true
                userExistWithEmail ? res.status(401).json({ success: false, message: "Email is already in use" }) : null
            }
            if (req.body.phoneNumber !== req.user.phoneNumber) {
                const userExistWithNumber = await User.findOne({ phoneNumber: req.body.number || req.body.phoneNumber })
                userExistWithNumber ? validPhoneNumber = false : validPhoneNumber = true
                userExistWithNumber ? res.status(401).json({ success: false, message: "Phone number is already in use" }) : null
            }


            if (validEmail && validPhoneNumber) {

                const user = await User.findByIdAndUpdate({ _id: id }, req.body, { new: true });

                if (user) {
                    res.status(200).json({ success: true, message: "Profile Updated Successfully" })
                } else {
                    res.status(404).json({ success: false, message: "User not found" })
                }
            }



        }
    } catch (err) {
        res.status(500).json({ success: false, message: err });
    }
}


module.exports = {
    registration,
    login,
    getProfile,
    updateProfile
};
