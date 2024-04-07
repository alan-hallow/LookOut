const express = require("express");
const router = express.Router();
const missingVehicle = require("../../models/missing-vehicle-post");
const missingVehicleHelper = require("../../helpers/user/helper-missing-vehicle");
const missingVehicleComment = require("../../models/model-vehicle-comment");
const missingVehicleCommentHelper = require("../../helpers/user/helper-vehicle-comment");
const missingVehicleUpdate = require("../../models/admin-model-vehicle-update");
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
      const missingvehicleinfo = await missingVehicle
        .find()
        .sort({ createddate: "desc" });
      res.render("user/vehicle/missingvehicle", {
        vehicleMissing: missingvehicleinfo,
        usersNotificationDetails: usersNotificationDetails,
        session: req.session,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send("An error occurred while fetching missing vehicle data.");
  }
});

router.get("/createMissingVehiclePost", async (req, res) => {
  const userId = req.session.userId;

  const usersNotificationDetails = await usersNotification.find({
    postId: userId,
  });
  res.render("user/vehicle/newmissingvehiclepost", {
    session: req.session,
    usersNotificationDetails: usersNotificationDetails,
  });
});

router.get("/missingvehiclenewpost/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.session.userId;

    const usersNotificationDetails = await usersNotification.find({
      postId: userId,
    });
    // Find all comments associated with the given postId
    const missingVehicleComments = await missingVehicleComment.find({ postId });
    const missingVehicleUpdates = await missingVehicleUpdate.find({ postId });
    const missingVehicleDetails = await missingVehicle.findById(req.params.id);
    if (!missingVehicleDetails) {
      res.redirect("/");
    } else {
      res.render("user/vehicle/missingvehicledisplay", {
        missingvehiclefulldetails: missingVehicleDetails,
        missingvehiclecomments: missingVehicleComments, // Pass the comments to the view
        missingVehicleUpdates: missingVehicleUpdates, // Pass the comments to the view
        usersNotificationDetails: usersNotificationDetails,
        session: req.session,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send("An error occurred while fetching missing vehicle details.");
  }
});

router.post("/missingvehiclepostrequest", async (req, res) => {
  try {
    const savedMissingVehicle = await missingVehicleHelper.helperMissingVehicle(
      req.body
    );
    console.log("Saved missing vehicle:", savedMissingVehicle);
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
          "missingvehicle",
          `${savedMissingVehicle.id}.jpg`
        )
      );
    }

    // Redirect after saving missing kid
    res.redirect(`missingvehiclenewpost/${savedMissingVehicle.id}`);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send("An error occurred while saving missing vehicle data.");
  }
});

router.post("/commentForMissingVehicle", async (req, res) => {
  try {
    if (!req.session.username) {
      res.redirect("/signin");
    } else {
      // Assuming req.body contains the necessary data for the new comment
      const newCommentSaved = await missingVehicleCommentHelper.newComment(
        req.body
      );

      // Get the postId from the request body
      const postId = req.body.postId;

      // Redirect back to the original page
      res.redirect(`/missingvehicle/missingvehiclenewpost/${postId}`);
    }
  } catch (error) {
    console.error("Error:", error);
    // Respond with an error message
    res.status(500).send("An error occurred while saving the comment.");
  }
});

module.exports = router;
