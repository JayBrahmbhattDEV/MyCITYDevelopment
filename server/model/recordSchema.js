const mongoose = require("mongoose");

const recordSchema = mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  location: {
    type: Object,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
  },
  userId: {
    type: String,
  },
  category: {
    type: String,
  },
  subCategory: {
    type: String,
  },
  imgUrl: {
    type: String,
  },
  isPending: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Record", recordSchema);
