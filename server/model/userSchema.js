const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is required",
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: "Phone number is required",
    match: [
      /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/,
      "Please enter a valid phone number",
    ],
  },
  dob: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
