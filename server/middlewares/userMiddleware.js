const User = require("../model/userSchema")

const checkUserExist = async (req, res, next) => {
    const userExistWithEmail = await User.findOne({ email: req.body.email })
    const userExistWithNumber = await User.findOne({ phoneNumber: req.body.number })
    if (userExistWithEmail) {
        res.status(401).json({ success: false, message: "Email is already in use" })
    } else if (userExistWithNumber) {
        res.status(401).json({ success: false, message: "Phone number is already in use" })
    } else {
        next();
    }
}

module.exports = { checkUserExist }