const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  category: {
    type: String,
  },
  subCategories: {
    type: Array,
  },
});

module.exports = mongoose.model("Category", categorySchema);
