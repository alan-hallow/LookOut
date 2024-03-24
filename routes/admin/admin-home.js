const express = require("express");
const router = express.Router();

const missingKids = require("../../models/missing-kids-post");
const missingElderly = require("../../models/missing-elderly-post");
const missingPets = require("../../models/missing-pets-post");
const missingValuable = require("../../models/missing-valuable-post");
const missingVehicle = require("../../models/missing-vehicle-post");
const corpse = require("../../models/corpses-post");

const missingKidsComment = require("../../models/model-kids-comment");
const missingKidCommentHelper = require("../../helpers/user/helper-kid-comment");
const missingKidsUpdate = require("../../models/admin-model-kids-update");
const missingKidUpdateHelper = require("../../helpers/admin/admin-kids");

const missingElderlyComment = require("../../models/model-elderly-comment");
const missingElderlyCommentHelper = require("../../helpers/user/helper-elderly-comment");
const missingElderlyUpdate = require("../../models/admin-model-elderly-update");
const missingElderlyUpdateHelper = require("../../helpers/admin/admin-elderly");

const missingPetsComment = require("../../models/model-pets-comment");
const missingPetsCommentHelper = require("../../helpers/user/helper-pets-comment");
const missingPetsUpdate = require("../../models/admin-model-pets-update");
const missingPetsUpdateHelper = require("../../helpers/admin/admin-pets");

const missingVehicleComment = require("../../models/model-vehicle-comment");
const missingVehicleCommentHelper = require("../../helpers/user/helper-vehicle-comment");
const missingVehicleUpdate = require("../../models/admin-model-vehicle-update");
const missingVehicleUpdateHelper = require("../../helpers/admin/admin-vehicles");

const missingValuableComment = require("../../models/model-valuable-comment");
const missingValuableCommentHelper = require("../../helpers/user/helper-valuable-comment");
const missingValuableUpdate = require("../../models/admin-model-valuable-update");
const missingValuableUpdateHelper = require("../../helpers/admin/admin-valuables");

const usersnotifications = require("../../models/admin-model-users-notification");
const usersNotificationHelper = require("../../helpers/admin/admin-users");

const corpsesComment = require("../../models/model-corpses-comment");
const corpsesCommentHelper = require("../../helpers/user/helper-corpses-comment");

const userDataHelper = require("./../../helpers/user/helper-signup");

const users = require("../../models/models-signup");

//admin code to bottom

router.get("/", async (req, res) => {
  const countUsers = await users.countDocuments();
  const countKids = await missingKids.countDocuments();
  const countElderly = await missingElderly.countDocuments();
  const countPets = await missingPets.countDocuments();
  const countVehicles = await missingVehicle.countDocuments();
  const countValuables = await missingValuable.countDocuments();
  const countCorpses = await corpses.countDocuments();
  res.render("admin/admin-home", {
    countUsers,
    countKids,
    countElderly,
    countPets,
    countVehicles,
    countValuables,
    countCorpses,
  });
});

// admin-users
//
//
//
//
//
router.get("/users", async (req, res) => {
  try {
    const usersinfo = await users.find().sort({ createddate: "desc" });
    res.render("admin/users/users-home", {
      usersinfo: usersinfo,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

router.get("/users-display/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    const usersDetails = await users.findById(postId);
    const usersNotificationDetails = await usersnotifications.find({ postId });
    if (!usersDetails) {
      res.redirect("/admin-users");
    } else {
      res.render("admin/users/users-display", {
        usersDetails: usersDetails,
        usersNotificationDetails: usersNotificationDetails,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

router.post("/users/notification", async (req, res) => {
  try {
    // Assuming req.body contains the necessary data for the new comment
    const newNotificationSaved = await usersNotificationHelper.newNotification(
      req.body
    );

    // Get the postId from the request body
    const postId = req.body.postId;

    // Redirect back to the original page
    res.redirect(`/admin/users-display/${postId}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});
// admin-elderly
//
//
//
//
//
router.get("/admin-kids", async (req, res) => {
  try {
    const missingkidsinfo = await missingKids
      .find()
      .sort({ createddate: "desc" });
    res.render("admin/kids/kids-home", {
      childMissing: missingkidsinfo,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

router.get("/kids-display/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    const missingKidUpdates = await missingKidsUpdate.find({ postId });
    const missingKidComments = await missingKidsComment.find({ postId });

    const missingKidDetails = await missingKids.findById(postId);
    if (!missingKidDetails) {
      res.redirect("/admin-kids");
    } else {
      res.render("admin/kids/kids-display", {
        missingkidsfulldetails: missingKidDetails,
        missingKidUpdates: missingKidUpdates, // Pass the comments to the view
        missingkidcomments: missingKidComments, // Pass the comments to the view
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

router.post("/kids/newUpdate", async (req, res) => {
  try {
    // Assuming req.body contains the necessary data for the new comment
    const newUpdateSaved = await missingKidUpdateHelper.newUpdate(req.body);

    // Get the postId from the request body
    const postId = req.body.postId;

    // Redirect back to the original page
    res.redirect(`/admin/kids-display/${postId}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

// admin-elderly
//
//
//
//
//
router.get("/admin-elderly", async (req, res) => {
  try {
    const missingelderlyinfo = await missingElderly
      .find()
      .sort({ createddate: "desc" });
    res.render("admin/elderly/elderly-home", {
      elderlyMissing: missingelderlyinfo,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

router.get("/elderly-display/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    const missingElderlyUpdates = await missingElderlyUpdate.find({ postId });
    const missingElderlyComments = await missingElderlyComment.find({ postId });

    const missingElderlyDetails = await missingElderly.findById(postId);
    if (!missingElderlyDetails) {
      res.redirect("/admin-elderly");
    } else {
      res.render("admin/elderly/elderly-display", {
        missingElderlyfulldetails: missingElderlyDetails,
        missingElderlyUpdates: missingElderlyUpdates, // Pass the comments to the view
        missingElderlyComments: missingElderlyComments, // Pass the comments to the view
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

router.post("/elderly/newUpdate", async (req, res) => {
  try {
    // Assuming req.body contains the necessary data for the new comment
    const newUpdateSaved = await missingElderlyUpdateHelper.newUpdate(req.body);

    // Get the postId from the request body
    const postId = req.body.postId;

    // Redirect back to the original page
    res.redirect(`/admin/elderly-display/${postId}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

// admin-pets
//
//
//
//
//
router.get("/admin-pets", async (req, res) => {
  try {
    const missingpetsinfo = await missingPets
      .find()
      .sort({ createddate: "desc" });
    res.render("admin/pets/pets-home", {
      petsMissing: missingpetsinfo,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

router.get("/pets-display/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    const missingPetsUpdates = await missingPetsUpdate.find({ postId });
    const missingPetsComments = await missingPetsComment.find({ postId });

    const missingPetsDetails = await missingPets.findById(postId);
    if (!missingPetsDetails) {
      res.redirect("/admin-pets");
    } else {
      res.render("admin/pets/pets-display", {
        missingPetsfulldetails: missingPetsDetails,
        missingPetsUpdates: missingPetsUpdates, // Pass the comments to the view
        missingPetsComments: missingPetsComments, // Pass the comments to the view
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

router.post("/pets/newUpdate", async (req, res) => {
  try {
    // Assuming req.body contains the necessary data for the new comment
    const newUpdateSaved = await missingPetsUpdateHelper.newUpdate(req.body);

    // Get the postId from the request body
    const postId = req.body.postId;

    // Redirect back to the original page
    res.redirect(`/admin/pets-display/${postId}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

// admin-vehicle
//
//
//
//
//
router.get("/admin-vehicles", async (req, res) => {
  try {
    const missingvehicleinfo = await missingVehicle
      .find()
      .sort({ createddate: "desc" });
    res.render("admin/vehicle/vehicle-home", {
      vehicleMissing: missingvehicleinfo,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

router.get("/vehicle-display/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    const missingVehicleUpdates = await missingVehicleUpdate.find({ postId });
    const missingVehicleComments = await missingVehicleComment.find({ postId });

    const missingVehicleDetails = await missingVehicle.findById(postId);
    if (!missingVehicleDetails) {
      res.redirect("/admin-vehicle");
    } else {
      res.render("admin/vehicle/vehicle-display", {
        missingVehiclefulldetails: missingVehicleDetails,
        missingVehicleUpdates: missingVehicleUpdates, // Pass the comments to the view
        missingVehicleComments: missingVehicleComments, // Pass the comments to the view
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

router.post("/vehicle/newUpdate", async (req, res) => {
  try {
    // Assuming req.body contains the necessary data for the new comment
    const newUpdateSaved = await missingVehicleUpdateHelper.newUpdate(req.body);

    // Get the postId from the request body
    const postId = req.body.postId;

    // Redirect back to the original page
    res.redirect(`/admin/vehicle-display/${postId}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

// admin-valuable
//
//
//
//
//
router.get("/admin-valuables", async (req, res) => {
  try {
    const missingvaluableinfo = await missingValuable
      .find()
      .sort({ createddate: "desc" });
    res.render("admin/valuable/valuable-home", {
      valuableMissing: missingvaluableinfo,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

router.get("/valuable-display/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    const missingValuableUpdates = await missingValuableUpdate.find({ postId });
    const missingValuableComments = await missingValuableComment.find({
      postId,
    });

    const missingValuableDetails = await missingValuable.findById(postId);
    if (!missingValuableDetails) {
      res.redirect("/admin-valuable");
    } else {
      res.render("admin/valuable/valuable-display", {
        missingValuablefulldetails: missingValuableDetails,
        missingValuableUpdates: missingValuableUpdates, // Pass the comments to the view
        missingValuableComments: missingValuableComments, // Pass the comments to the view
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

router.post("/valuable/newUpdate", async (req, res) => {
  try {
    // Assuming req.body contains the necessary data for the new comment
    const newUpdateSaved = await missingValuableUpdateHelper.newUpdate(
      req.body
    );

    // Get the postId from the request body
    const postId = req.body.postId;

    // Redirect back to the original page
    res.redirect(`/admin/valuable-display/${postId}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

// admin-corpse
//
//
//
//
//
router.get("/admin-corpse", async (req, res) => {
  try {
    const corpseinfo = await corpse.find().sort({ createddate: "desc" });
    res.render("admin/corpses/corpses-home", {
      corpses: corpseinfo,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});
module.exports = router;
