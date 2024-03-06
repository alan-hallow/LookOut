const mongoose = require("mongoose");

const missingVehicleSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  fuel: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  residency: {
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

module.exports = mongoose.model("missingvehicle", missingVehicleSchema);
