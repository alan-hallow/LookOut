const mongoose = require("mongoose");

const missingVehicleCommentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createddate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model(
  "missingVehicleComment",
  missingVehicleCommentSchema
);
