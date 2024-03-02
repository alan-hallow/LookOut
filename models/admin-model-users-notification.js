const mongoose = require("mongoose");

const usersNotificationSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  notification: {
    type: String,
    required: true,
  },
  createddate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("usersNotification", usersNotificationSchema);
