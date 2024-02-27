const express = require("express");
const missingElderly = require("../../models/missing-elderly-post");
const missingElderlyHelper = require("../../helpers/user/helper-missing-elderly");
const missingElderlyComment = require("../../models/model-elderly-comment");
const missingElderlyCommentHelper = require("../../helpers/user/helper-elderly-comment");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", async (req, res) => {
  try {
    console.log(
      req.session.username,
      req.session.useremail,
      req.session.userphone,
      req.session.userplace
    );
    const missingelderlyinfo = await missingElderly
      .find()
      .sort({ createddate: "desc" });
    res.render("user/elderly/missingelderly", {
      elderlyMissing: missingelderlyinfo,
      session: req.session,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send("An error occurred while fetching missing elderly data.");
  }
});

router.get("/createMissingElderlyPost", (req, res) => {
  res.render("user/elderly/newmissingelderlypost", {
    session: req.session,
  });
});

router.get("/missingelderlynewpost/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    // Find all comments associated with the given postId
    const missingElderlyComments = await missingElderlyComment.find({ postId });
    const missingElderlyDetails = await missingElderly.findById(postId);
    if (!missingElderlyDetails) {
      res.redirect("/");
    } else {
      res.render("user/elderly/missingelderlydisplay", {
        missingelderlyfulldetails: missingElderlyDetails,
        missingelderlycomments: missingElderlyComments, // Pass the comments to the view
        session: req.session,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send("An error occurred while fetching missing elderly details.");
  }
});

router.post("/missingelderlypostrequest", async (req, res) => {
  try {
    const savedMissingElderly = await missingElderlyHelper.helperMissingElderly(
      req.body
    );
    console.log("Saved missing elderly:", savedMissingElderly);
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
          "missingelderly",
          `${savedMissingElderly.id}.jpg`
        )
      );
    }

    // Redirect after saving missing kid
    res.redirect(`missingelderlynewpost/${savedMissingElderly.id}`);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send("An error occurred while saving missing elderly data.");
  }
});

router.post("/commentForMissingElderly", async (req, res) => {
  try {
    // Assuming req.body contains the necessary data for the new comment
    const newCommentSaved = await missingElderlyCommentHelper.newComment(
      req.body
    );

    // Get the postId from the request body
    const postId = req.body.postId;

    // Redirect back to the original page
    res.redirect(`/missingelderly/missingelderlynewpost/${postId}`);
  } catch (error) {
    console.error("Error:", error);
    // Respond with an error message
    res.status(500).send("An error occurred while saving the comment.");
  }
});

module.exports = router;
