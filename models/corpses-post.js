const mongoose = require("mongoose");

const corpsesSchema = new mongoose.Schema({
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
  color: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },
  eye: {
    type: String,
    required: true,
  },
  marks: {
    type: String,
    required: true,
  },
  dress: {
    type: String,
    required: true,
  },
  additional: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("corpses", corpsesSchema);
