const express = require("express");
const router = express.Router();
const missingKids = require("../../models/missing-kids-post");
const missingKidsHelper = require("../../helpers/user/helper-missing-kid");
const missingKidsComment = require("../../models/model-kids-comment");
const missingKidCommentHelper = require("../../helpers/user/helper-kid-comment");
const missingKidsUpdate = require("../../models/admin-model-kids-update");
const missingKidUpdateHelper = require("../../helpers/admin/admin-kids");
const usersNotification = require("../../models/admin-model-users-notification");
const usersNotificationHelper = require("../../helpers/admin/admin-users");
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
      const username = req.session.username;
      const missingkidsinfo = await missingKids
        .find()
        .sort({ createddate: "desc" });
      res.render("user/kids/missingkids", {
        childMissing: missingkidsinfo,
        usersNotificationDetails: usersNotificationDetails,
        session: req.session,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching missing kids data.");
  }
});

router.get("/createMissingKidPost", async (req, res) => {
  const userId = req.session.userId;

  const usersNotificationDetails = await usersNotification.find({
    postId: userId,
  });

  if (req.session.theme === "light") {
    res.render("user/kids/newmissingkidpost", {
      session: req.session,
      usersNotificationDetails: usersNotificationDetails,
    });
  } else {
    res.render("user/kids/kids_post_dark", {
      session: req.session,
      usersNotificationDetails: usersNotificationDetails,
    });
  }
});

router.get("/missingkidnewpost/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.session.userId;

    const usersNotificationDetails = await usersNotification.find({
      postId: userId,
    });

    const missingKidUpdates = await missingKidsUpdate.find({ postId });
    // Find all comments associated with the given postId
    const missingKidComments = await missingKidsComment.find({ postId });

    const missingKidDetails = await missingKids.findById(postId);
    if (!missingKidDetails) {
      res.redirect("/");
    } else {
      if (req.session.theme === "light") {
        res.render("user/kids/missingkiddisplay", {
          missingkidsfulldetails: missingKidDetails,
          missingKidUpdates: missingKidUpdates, // Pass the comments to the view
          missingkidcomments: missingKidComments, // Pass the comments to the view
          usersNotificationDetails: usersNotificationDetails,
          session: req.session,
        });
      } else {
        res.render("user/kids/kids_display_dark", {
          missingkidsfulldetails: missingKidDetails,
          missingKidUpdates: missingKidUpdates, // Pass the comments to the view
          missingkidcomments: missingKidComments, // Pass the comments to the view
          usersNotificationDetails: usersNotificationDetails,
          session: req.session,
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send("An error occurred while fetching missing kid details.");
  }
});

router.post("/missingkidspostrequest", async (req, res) => {
  try {
    const savedMissingKid = await missingKidsHelper.helperMissingKids(req.body);
    console.log("Saved missing kid:", savedMissingKid);
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
          "missingkids",
          `${savedMissingKid.id}.jpg`
        )
      );
    }

    // Redirect after saving missing kid
    res.redirect(`missingkidnewpost/${savedMissingKid.id}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while saving missing kid data.");
  }
});

router.post("/commentForMissingKids", async (req, res) => {
  try {
    if (!req.session.username) {
      res.redirect("/signin");
    } else {
      // Assuming req.body contains the necessary data for the new comment
      const newCommentSaved = await missingKidCommentHelper.newComment(
        req.body
      );

      // Get the postId from the request body
      const postId = req.body.postId;

      // Redirect back to the original page
      res.redirect(`/missingkids/missingkidnewpost/${postId}`);
    }
  } catch (error) {
    console.error("Error:", error);
    // Respond with an error message
    res.status(500).send("An error occurred while saving the comment.");
  }
});

module.exports = router;
