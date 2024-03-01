const mongoose = require("mongoose");

const missingVehicleUpdateSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  update: {
    type: String,
    required: true,
  },
  createddate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "missingVehicleUpdate",
  missingVehicleUpdateSchema
);