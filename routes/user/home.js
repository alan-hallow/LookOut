const express = require("express");
const missingKids = require("../../models/missing-kids-post");
const missingElderly = require("../../models/missing-elderly-post");
const missingPets = require("../../models/missing-pets-post");
const missingValuable = require("../../models/missing-valuable-post");
const missingVehicle = require("../../models/missing-vehicle-post");

const userDataHelper = require("./../../helpers/user/helper-signup");

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

const users = require("../../models/models-signup");
const router = express.Router();
const bcrypt = require("bcrypt");
const session = require("express-session");

router.get("/", (req, res) => {
  const username = req.session.username;
  res.render("user/home", {
    body: "hello",
    username: username,
    session: req.session,
  }); // Render the home template with the username retrieved from the session
});

router.get("/signup", (req, res) => {
  res.render("user/signup", {
    session: req.session,
  });
});

router.get("/signin", (req, res) => {
  const passwordError = req.query.data === "passwordError"; // Check if the query parameter 'data' is 'passwordError'
  const emailError = req.query.data === "emailNotFound"; // Check if the query parameter 'data' is 'emailNotFound'
  res.render("user/signin", {
    errorMessage: { passwordError, emailError },
    session: req.session,
  }); // Render the signin template initially
});

router.post("/userSignup", async (req, res) => {
  try {
    const usersData = await userDataHelper.userData(req.body);
    console.log(usersData);
    res.redirect("/signin"); // Redirect to signin after signup
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("An error occurred while saving users data.");
  }
});

router.post("/userSignIn", async (req, res) => {
  try {
    if (req.body.email == "admin" && req.body.password == "admin123") {
      res.redirect("/admin");
    } else {
      const userEmail = await users.findOne({ email: req.body.email });

      if (userEmail) {
        const loginPassword = req.body.password;
        const dbUserPassword = userEmail.password;
        bcrypt.compare(loginPassword, dbUserPassword, function (err, result) {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .send("An error occurred while trying to login.");
          }
          if (result) {
            // Passwords match, proceed with login
            // Assign session variables with values from the retrieved user object
            req.session.useremail = userEmail.email;
            req.session.username = userEmail.name;
            req.session.userphone = userEmail.phone;
            req.session.userplace = userEmail.place;

            console.log("Data stored in session");
            // Send appropriate response to the client
            return res.redirect("/");
          } else {
            // Passwords don't match, handle accordingly
            return res.redirect("/signin?data=passwordError");
          }
        });
      } else {
        return res.redirect("/signin?data=emailNotFound");
      }
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).send("An error occurred while trying to login.");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("An error occurred while logging out.");
    } else {
      console.log("session destroyed");
      res.redirect("/signin");
    }
  });
});

//admin code to bottom

router.get("/admin", async (req, res) => {
  const countUsers = await users.countDocuments();
  const countKids = await missingKids.countDocuments();
  const countElderly = await missingElderly.countDocuments();
  const countPets = await missingPets.countDocuments();
  const countVehicles = await missingVehicle.countDocuments();
  const countValuables = await missingValuable.countDocuments();
  res.render("admin/admin-home", {
    countUsers,
    countKids,
    countElderly,
    countPets,
    countVehicles,
    countValuables,
  });
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

router.post("/admin/kids/newUpdate", async (req, res) => {
  try {
    // Assuming req.body contains the necessary data for the new comment
    const newUpdateSaved = await missingElderlyUpdateHelper.newUpdate(req.body);

    // Get the postId from the request body
    const postId = req.body.postId;

    // Redirect back to the original page
    res.redirect(`/kids-display/${postId}`);
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

router.post("/admin/elderly/newUpdate", async (req, res) => {
  try {
    // Assuming req.body contains the necessary data for the new comment
    const newUpdateSaved = await missingElderlyUpdateHelper.newUpdate(req.body);

    // Get the postId from the request body
    const postId = req.body.postId;

    // Redirect back to the original page
    res.redirect(`/elderly-display/${postId}`);
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

router.post("/admin/pets/newUpdate", async (req, res) => {
  try {
    // Assuming req.body contains the necessary data for the new comment
    const newUpdateSaved = await missingPetsUpdateHelper.newUpdate(req.body);

    // Get the postId from the request body
    const postId = req.body.postId;

    // Redirect back to the original page
    res.redirect(`/pets-display/${postId}`);
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
router.get("/admin-vehicle", async (req, res) => {
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

router.post("/admin/vehicle/newUpdate", async (req, res) => {
  try {
    // Assuming req.body contains the necessary data for the new comment
    const newUpdateSaved = await missingVehicleUpdateHelper.newUpdate(req.body);

    // Get the postId from the request body
    const postId = req.body.postId;

    // Redirect back to the original page
    res.redirect(`/vehicle-display/${postId}`);
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
router.get("/admin-valuable", async (req, res) => {
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

router.post("/admin/valuable/newUpdate", async (req, res) => {
  try {
    // Assuming req.body contains the necessary data for the new comment
    const newUpdateSaved = await missingValuableUpdateHelper.newUpdate(
      req.body
    );

    // Get the postId from the request body
    const postId = req.body.postId;

    // Redirect back to the original page
    res.redirect(`/valuable-display/${postId}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

module.exports = router;
