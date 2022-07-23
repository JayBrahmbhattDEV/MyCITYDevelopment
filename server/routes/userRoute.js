const express = require("express");
const { registration, login } = require("../controllers/user");
const router = express.Router();
const { checkUserExist } = require("../middlewares/userMiddleware")

router.route("/register").post(checkUserExist, registration)
router.route("/login").post(login)

module.exports = router;