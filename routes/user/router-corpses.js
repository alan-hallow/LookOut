const express = require("express");
const router = express.Router();
const corpses = require("../../models/corpses-post");
const corpsesHelper = require("../../helpers/user/helper-corpses");
const corpsesComment = require("../../models/model-corpses-comment");
const corpsesCommentHelper = require("../../helpers/user/helper-corpses-comment");
const usersNotification = require("../../models/admin-model-users-notification");
const usersNotificationHelper = require("../../helpers/admin/admin-users");
const fs = require("fs");
const path = require("path");

router.get("/", async (req, res) => {
  if (!req.session.username) {
    res.redirect("/signin");
  } else {
    const corpsinfo = await corpses.find().sort({ createddate: "desc" });
    const userId = req.session.userId;

    const usersNotificationDetails = await usersNotification.find({
      postId: userId,
    });
    if (req.session.theme === "light") {
      res.render("user/corpses/corpses-display", {
        corpses: corpsinfo,
        usersNotificationDetails: usersNotificationDetails,
        session: req.session,
      });
    } else {
      res.render("user/corpses/corpse_dark", {
        corpses: corpsinfo,
        usersNotificationDetails: usersNotificationDetails,
        session: req.session,
      });
    }
  }
});

router.get("/createCorpsePost", async (req, res) => {
  const userId = req.session.userId;

  const usersNotificationDetails = await usersNotification.find({
    postId: userId,
  });
  if (req.session.theme === "light") {
    res.render("user/corpses/corpses-add", {
      usersNotificationDetails: usersNotificationDetails,
      session: req.session,
    });
  } else {
    res.render("user/corpses/corpse_add_dark", {
      usersNotificationDetails: usersNotificationDetails,
      session: req.session,
    });
  }
});

router.get("/corpsesnewpost/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.session.userId;

    const usersNotificationDetails = await usersNotification.find({
      postId: userId,
    });
    // Find all comments associated with the given postId
    const corpsesComments = await corpsesComment.find({ postId });
    const corpsesDetails = await corpses.findById(postId);
    if (!corpsesDetails) {
      res.redirect("/");
    } else {
      if (req.session.theme === "light") {
        res.render("user/corpses/corpses-details", {
          corpsesfulldetails: corpsesDetails,
          usersNotificationDetails: usersNotificationDetails,
          corpsescomments: corpsesComments, // Pass the comments to the view
          session: req.session,
        });
      } else {
        res.render("user/corpses/corpses_details_dark", {
          corpsesfulldetails: corpsesDetails,
          usersNotificationDetails: usersNotificationDetails,
          corpsescomments: corpsesComments, // Pass the comments to the view
          session: req.session,
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

router.post("/corpsepostrequest", async (req, res) => {
  try {
    const savedCorpses = await corpsesHelper.helperCorpses(req.body);
    console.log("Saved corpse:", savedCorpses);
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
          "corpses",
          `${savedCorpses.id}.jpg`
        )
      );
    }

    // Redirect after saving missing kid
    res.redirect(`corpsesnewpost/${savedCorpses.id}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

router.post("/commentForCorpses", async (req, res) => {
  try {
    // Assuming req.body contains the necessary data for the new comment
    const newCommentSaved = await corpsesCommentHelper.newComment(req.body);

    // Get the postId from the request body
    const postId = req.body.postId;

    // Redirect back to the original page
    res.redirect(`/corpses/corpsesnewpost/${postId}`);
  } catch (error) {
    console.error("Error:", error);
    // Respond with an error message
    res.status(500).send("An error occurred while saving the comment.");
  }
});
module.exports = router;
