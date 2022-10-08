const Category = require("../model/categorySchema");
const categoryRouter = require("../routes/categoryRoute");
var { ObjectID } = require("mongodb");
const {
  AclRoleAccessorMethods,
} = require("@google-cloud/storage/build/src/acl");

const addCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      data: { message: "Category added successfully" },
    });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
};

const addNewCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      data: { message: "New Category added successfully", id: category._id },
    });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
};

const addSubCategory = async (req, res) => {
  const categoryID = req.params.id;
  const isCategoryExist = await Category.findById({ _id: categoryID });
  if (!isCategoryExist) {
    return res.status(404).json({
      success: false,
      message: `No category exist with this id ${categoryID}`,
    });
  }
  const category = await Category.findByIdAndUpdate(
    { _id: categoryID },
    {
      $push: {
        subCategories: {
          id: new ObjectID(),
          name: req.body.subCategory,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json({
    success: true,
    data: { message: "Subcategory added successfully" },
  });
  try {
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
};

const getCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({}, { _id: 1, category: 1 });
    res.status(200).json({ success: true, data: allCategories });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
};

const getSubCategories = async (req, res) => {
  try {
    const categoryID = req.params.id;
    const isCategoryExist = await Category.findById({ _id: categoryID });

    if (!isCategoryExist) {
      return res.status(404).json({
        success: false,
        message: `No category exist with this id ${categoryID}`,
      });
    }
    const subcategories = await Category.findById({ _id: categoryID });
    res.status(200).json({ success: true, data: subcategories });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
};

module.exports = {
  addCategory,
  addNewCategory,
  addSubCategory,
  getCategories,
  getSubCategories,
};
