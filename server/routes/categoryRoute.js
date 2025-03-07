const express = require("express");
const {
  addCategory,
  addNewCategory,
  addSubCategory,
  getCategories,
  getSubCategories,
} = require("../controllers/category");
const categoryRouter = express.Router();

categoryRouter.route("/addCategory").post(addNewCategory);
categoryRouter.route("/addSubCategory/:id").patch(addSubCategory);
categoryRouter.route("/allCategories").get(getCategories);
categoryRouter.route("/subCategories/:id").get(getSubCategories);

module.exports = categoryRouter;
