const express = require("express");
const missingElderly = require("../../models/missing-elderly-post");
const missingElderlyHelper = require("../../helpers/user/helper-missing-elderly");
const missingElderlyComment = require("../../models/model-elderly-comment");
const missingElderlyCommentHelper = require("../../helpers/user/helper-elderly-comment");
const missingElderlyUpdate = require("../../models/admin-model-elderly-update");
const usersNotification = require("../../models/admin-model-users-notification");
const usersNotificationHelper = require("../../helpers/admin/admin-users");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", async (req, res) => {
  try {
    if (!req.session.username) {
      res.redirect("/signin");
    } else {
      const userId = req.session.userId;

      const usersNotificationDetails = await usersNotification.find({
        postId: userId,
      });
      const missingelderlyinfo = await missingElderly
        .find()
        .sort({ createddate: "desc" });
      res.render("user/elderly/missingelderly", {
        elderlyMissing: missingelderlyinfo,
        usersNotificationDetails: usersNotificationDetails,
        session: req.session,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send("An error occurred while fetching missing elderly data.");
  }
});

router.get("/createMissingElderlyPost", async (req, res) => {
  const userId = req.session.userId;

  const usersNotificationDetails = await usersNotification.find({
    postId: userId,
  });
  res.render("user/elderly/newmissingelderlypost", {
    session: req.session,
    usersNotificationDetails: usersNotificationDetails,
  });
});

router.get("/missingelderlynewpost/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.session.userId;

    const usersNotificationDetails = await usersNotification.find({
      postId: userId,
    });
    // Find all comments associated with the given postId
    const missingElderlyUpdates = await missingElderlyUpdate.find({ postId });
    const missingElderlyComments = await missingElderlyComment.find({ postId });
    const missingElderlyDetails = await missingElderly.findById(postId);
    if (!missingElderlyDetails) {
      res.redirect("/");
    } else {
      res.render("user/elderly/missingelderlydisplay", {
        missingelderlyfulldetails: missingElderlyDetails,
        missingElderlyUpdates: missingElderlyUpdates, // Pass the comments to the view
        missingelderlycomments: missingElderlyComments, // Pass the comments to the view
        usersNotificationDetails: usersNotificationDetails,
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
    if (!req.session.username) {
      res.redirect("/signin");
    } else {
      // Assuming req.body contains the necessary data for the new comment
      const newCommentSaved = await missingElderlyCommentHelper.newComment(
        req.body
      );

      // Get the postId from the request body
      const postId = req.body.postId;

      // Redirect back to the original page
      res.redirect(`/missingelderly/missingelderlynewpost/${postId}`);
    }
  } catch (error) {
    console.error("Error:", error);
    // Respond with an error message
    res.status(500).send("An error occurred while saving the comment.");
  }
});

module.exports = router;
