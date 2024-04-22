const express = require("express");
const router = express.Router();
const missingPets = require("../../models/missing-pets-post");
const missingPetsHelper = require("../../helpers/user/helper-missing-pets");
const missingPetsComment = require("../../models/model-pets-comment");
const missingPetsUpdate = require("../../models/admin-model-pets-update");
const missingPetsCommentHelper = require("../../helpers/user/helper-pets-comment");
const usersNotification = require("../../models/admin-model-users-notification");
const usersNotificationHelper = require("../../helpers/admin/admin-users");
const fs = require("fs");
const path = require("path");

router.get("/", async (req, res) => {
  try {
    const userId = req.session.userId;

    const usersNotificationDetails = await usersNotification.find({
      postId: userId,
    });
    const missingpetsinfo = await missingPets
      .find()
      .sort({ createddate: "desc" });
    if (req.session.theme === "light") {
      res.render("user/pets/missingpets", {
        petsMissing: missingpetsinfo,
        usersNotificationDetails: usersNotificationDetails,
        session: req.session,
      });
    } else {
      res.render("user/pets/pets_dark", {
        petsMissing: missingpetsinfo,
        usersNotificationDetails: usersNotificationDetails,
        session: req.session,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching missing pets data.");
  }
});

router.get("/createMissingPetsPost", async (req, res) => {
  const userId = req.session.userId;

  const usersNotificationDetails = await usersNotification.find({
    postId: userId,
  });
  if (!req.session.username) {
    res.redirect("/signin");
  } else {
    if (req.session.theme === "light") {
      res.render("user/pets/newmissingpetspost", {
        session: req.session,
        usersNotificationDetails: usersNotificationDetails,
      });
    } else {
      res.render("user/pets/pets_post_dark", {
        session: req.session,
        usersNotificationDetails: usersNotificationDetails,
      });
    }
  }
});

router.get("/missingpetsnewpost/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.session.userId;

    const usersNotificationDetails = await usersNotification.find({
      postId: userId,
    });
    // Find all comments associated with the given postId
    const missingPetsComments = await missingPetsComment.find({ postId });
    const missingPetsUpdates = await missingPetsUpdate.find({ postId });
    const missingPetsDetails = await missingPets.findById(postId);
    if (!missingPetsDetails) {
      res.redirect("/");
    } else {
      if (!req.session.username) {
        res.redirect("/signin");
      } else {
        if (req.session.theme === "light") {
          res.render("user/pets/missingpetsdisplay", {
            missingpetsfulldetails: missingPetsDetails,
            missingPetsUpdates: missingPetsUpdates, // Pass the comments to the view
            missingpetscomments: missingPetsComments, // Pass the comments to the view
            usersNotificationDetails: usersNotificationDetails,
            session: req.session,
          });
        } else {
          res.render("user/pets/pets_display_dark", {
            missingpetsfulldetails: missingPetsDetails,
            missingPetsUpdates: missingPetsUpdates, // Pass the comments to the view
            missingpetscomments: missingPetsComments, // Pass the comments to the view
            usersNotificationDetails: usersNotificationDetails,
            session: req.session,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send("An error occurred while fetching missing pets details.");
  }
});

router.post("/missingpetspostrequest", async (req, res) => {
  try {
    const savedMissingPets = await missingPetsHelper.helperMissingPets(
      req.body
    );
    console.log("Saved missing pets:", savedMissingPets);
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
          "missingpets",
          `${savedMissingPets.id}.jpg`
        )
      );
    }

    // Redirect after saving missing kid
    res.redirect(`missingpetsnewpost/${savedMissingPets.id}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while saving missing pets data.");
  }
});

router.post("/commentForMissingPets", async (req, res) => {
  try {
    if (!req.session.username) {
      res.redirect("/signin");
    } else {
      // Assuming req.body contains the necessary data for the new comment
      const newCommentSaved = await missingPetsCommentHelper.newComment(
        req.body
      );

      // Get the postId from the request body
      const postId = req.body.postId;

      // Redirect back to the original page
      res.redirect(`/missingpets/missingpetsnewpost/${postId}`);
    }
  } catch (error) {
    console.error("Error:", error);
    // Respond with an error message
    res.status(500).send("An error occurred while saving the comment.");
  }
});
module.exports = router;
