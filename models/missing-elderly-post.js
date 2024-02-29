const mongoose = require("mongoose");

const missingElderlySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
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
  height: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  marks: {
    type: String,
    required: true,
  },
  religion: {
    type: String,
    required: true,
  },
  residence: {
    type: String,
    required: true,
  },
  dress: {
    type: String,
    required: true,
  },
  reward: {
    type: Number,
    required: true,
  },
  additional: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("missingelderly", missingElderlySchema);
