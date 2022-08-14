const express = require("express");
const userRouter = express.Router();
const { registration, login, getProfile, updateProfile } = require("../controllers/user");
const { authenticateToken } = require("../middlewares/recordMiddleware");
const { checkUserExist } = require("../middlewares/userMiddleware")

userRouter.route("/register").post(checkUserExist, registration)
userRouter.route("/login").post(login);
userRouter.route("/profile").get(authenticateToken, getProfile);
userRouter.route("/updateProfile").patch(authenticateToken, checkUserExist, updateProfile)

module.exports = userRouter;