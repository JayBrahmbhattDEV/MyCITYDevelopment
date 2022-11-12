const express = require("express");
const {
  addCategory,
  addNewCategory,
  addSubCategory,
  getCategories,
  getSubCategories,
} = require("../controllers/category");
const { authenticateToken } = require("../middlewares/recordMiddleware");
const categoryRouter = express.Router();

categoryRouter.route("/addCategory").post(authenticateToken, addNewCategory);
categoryRouter.route("/addSubCategory/:id").patch(authenticateToken, addSubCategory);
categoryRouter.route("/allCategories").get(getCategories);
categoryRouter.route("/subCategories/:id").get(getSubCategories);

module.exports = categoryRouter;
