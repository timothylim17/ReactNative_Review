const mongoose = require("mongoose");

const GoogleUser = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  id: { type: String, required: true },
});

module.exports = mongoose.model("GoogleUser", GoogleUser);