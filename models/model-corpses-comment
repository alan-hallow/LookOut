const mongoose = require("mongoose");

const corpsesCommentSchema = new mongoose.Schema({
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

module.exports = mongoose.model("corpsesComment", corpsesCommentSchema);
