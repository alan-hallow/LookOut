const express = require("express");
const missingValuable = require("../../models/missing-valuable-post");
const router = express.Router();
const missingValuableHelper = require("../../helpers/user/helper-missing-valuable");
const missingValuableComment = require("../../models/model-valuable-comment");
const missingValuableCommentHelper = require("../../helpers/user/helper-valuable-comment");
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
    const postId = req.params.id;
    // Find all comments associated with the given postId
    const missingValuableComments = await missingValuableComment.find({
      postId,
    });
    const missingValuableDetails = await missingValuable.findById(
      req.params.id
    );
    if (!missingValuableDetails) {
      res.redirect("/");
    } else {
      res.render("user/valuable/missingvaluabledisplay", {
        missingvaluablefulldetails: missingValuableDetails,
        missingvaluablecomments: missingValuableComments, // Pass the comments to the view
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

router.post("/commentForMissingValuable", async (req, res) => {
  try {
    // Assuming req.body contains the necessary data for the new comment
    const newCommentSaved = await missingValuableCommentHelper.newComment(
      req.body
    );

    // Get the postId from the request body
    const postId = req.body.postId;

    // Redirect back to the original page
    res.redirect(`/missingvaluable/missingvaluablenewpost/${postId}`);
  } catch (error) {
    console.error("Error:", error);
    // Respond with an error message
    res.status(500).send("An error occurred while saving the comment.");
  }
});

module.exports = router;
