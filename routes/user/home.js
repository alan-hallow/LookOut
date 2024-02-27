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

router.get("/admin-kids", async (req, res) => {
  try {
    const username = req.session.username;
    const missingkidsinfo = await missingKids
      .find()
      .sort({ createddate: "desc" });
    res.render("admin/kids/kids-home", {
      childMissing: missingkidsinfo,
      session: req.session,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching missing kids data.");
  }
});

router.get("/kids-display/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    const missingKidUpdates = await missingKidsUpdate.find({ postId });
    const missingKidComments = await missingKidsComment.find({ postId });

    const missingKidDetails = await missingKids.findById(postId);
    if (!missingKidDetails) {
      res.redirect("/");
    } else {
      res.render("admin/kids/kids-display", {
        missingkidsfulldetails: missingKidDetails,
        missingKidUpdates: missingKidUpdates, // Pass the comments to the view
        missingkidcomments: missingKidComments, // Pass the comments to the view
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send("An error occurred while fetching missing kid details.");
  }
});

router.post("/admin/newUpdate", async (req, res) => {
  try {
    // Assuming req.body contains the necessary data for the new comment
    const newUpdateSaved = await missingKidUpdateHelper.newUpdate(req.body);

    // Get the postId from the request body
    const postId = req.body.postId;

    // Redirect back to the original page
    res.redirect(`/kids-display/${postId}`);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send("An error occurred while fetching missing kid details.");
  }
});

module.exports = router;
