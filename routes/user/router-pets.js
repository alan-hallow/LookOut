const express = require("express");
const router = express.Router();
const missingPets = require("../../models/missing-pets-post");
const missingPetsHelper = require("../../helpers/user/helper-missing-pets");
const missingPetsComment = require("../../models/model-pets-comment");
const missingPetsCommentHelper = require("../../helpers/user/helper-pets-comment");
const fs = require("fs");
const path = require("path");

router.get("/", async (req, res) => {
  try {
    const missingpetsinfo = await missingPets
      .find()
      .sort({ createddate: "desc" });
    res.render("user/pets/missingpets", {
      petsMissing: missingpetsinfo,
      session: req.session,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching missing pets data.");
  }
});

router.get("/createMissingPetsPost", (req, res) => {
  res.render("user/pets/newmissingpetspost", {
    session: req.session,
  });
});

router.get("/missingpetsnewpost/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    // Find all comments associated with the given postId
    const missingPetsComments = await missingPetsComment.find({ postId });
    const missingPetsDetails = await missingPets.findById(postId);
    if (!missingPetsDetails) {
      res.redirect("/");
    } else {
      res.render("user/pets/missingpetsdisplay", {
        missingpetsfulldetails: missingPetsDetails,
        missingpetscomments: missingPetsComments, // Pass the comments to the view
        session: req.session,
      });
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
    // Assuming req.body contains the necessary data for the new comment
    const newCommentSaved = await missingPetsCommentHelper.newComment(req.body);

    // Get the postId from the request body
    const postId = req.body.postId;

    // Redirect back to the original page
    res.redirect(`/missingpets/missingpetsnewpost/${postId}`);
  } catch (error) {
    console.error("Error:", error);
    // Respond with an error message
    res.status(500).send("An error occurred while saving the comment.");
  }
});
module.exports = router;
