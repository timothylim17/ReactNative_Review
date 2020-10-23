const mongoose = require("mongoose");

const GoogleSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true }
});

module.exports = mongoose.model("Google", GoogleSchema);