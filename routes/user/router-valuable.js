const express = require("express");
const missingValuable = require("../../models/missing-valuable-post");
const router = express.Router();
const missingValuableHelper = require("../../helpers/user/helper-missing-valuable");
const fs = require("fs");
const path = require("path");

router.get("/", async (req, res) => {
  try {
    const missingvaluableinfo = await missingValuable
      .find()
      .sort({ createddate: "desc" });
    res.render("user/valuable/missingvaluable", {
      valuableMissing: missingvaluableinfo,
      session: req.session,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send("An error occurred while fetching missing valuable data.");
  }
});

router.get("/createMissingValuablePost", (req, res) => {
  res.render("user/valuable/newmissingvaluablepost", {
    session: req.session,
  });
});

router.get("/missingvaluablenewpost/:id", async (req, res) => {
  try {
    const missingValuableDetails = await missingValuable.findById(
      req.params.id
    );
    if (!missingValuableDetails) {
      res.redirect("/");
    } else {
      res.render("user/valuable/missingvaluabledisplay", {
        missingvaluablefulldetails: missingValuableDetails,
        session: req.session,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send("An error occurred while fetching missing valuable details.");
  }
});

router.post("/missingvaluablepostrequest", async (req, res) => {
  try {
    const savedMissingValuable =
      await missingValuableHelper.helperMissingValuable(req.body);
    console.log("Saved missing valuable:", savedMissingValuable);
    console.log(req.files.image);

    if (req.files && req.files.image) {
      let imageFile = req.files.image;
      // Use path.join for cross-platform compatibility
      imageFile.mv(
        path.join(
          __dirname,
          "../",
          "../",
          "public",
          "images",
          "missingvaluable",
          `${savedMissingValuable.id}.jpg`
        )
      );
    }

    // Redirect after saving missing kid
    res.redirect(`missingvaluablenewpost/${savedMissingValuable.id}`);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send("An error occurred while saving missing valuable data.");
  }
});

module.exports = router;
