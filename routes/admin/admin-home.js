const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin/admin-home"); // Render the home template with the username retrieved from the session
});
