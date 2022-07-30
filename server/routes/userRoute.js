const express = require("express");
const userRouter = express.Router();
const { registration, login } = require("../controllers/user");
const { checkUserExist } = require("../middlewares/userMiddleware")

userRouter.route("/register").post(checkUserExist, registration)
userRouter.route("/login").post(login)

module.exports = userRouter;