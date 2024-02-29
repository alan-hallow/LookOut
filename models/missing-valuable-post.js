const mongoose = require("mongoose");

const missingValuableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date, // Corrected
    required: true,
  },
  time: {
    type: String, // Corrected
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  reward: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  additional: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("missingvaluable", missingValuableSchema);
