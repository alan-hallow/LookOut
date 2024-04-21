const express = require("express");
const missingKids = require("../../models/missing-kids-post");
const missingElderly = require("../../models/missing-elderly-post");
const missingPets = require("../../models/missing-pets-post");
const missingValuable = require("../../models/missing-valuable-post");
const missingVehicle = require("../../models/missing-vehicle-post");

const userDataHelper = require("./../../helpers/user/helper-signup");

const usersNotification = require("../../models/admin-model-users-notification");
const usersNotificationHelper = require("../../helpers/admin/admin-users");

const users = require("../../models/models-signup");
const router = express.Router();
const bcrypt = require("bcrypt");
const session = require("express-session");

//
//
router.get("/", async (req, res) => {
  const username = req.session.username;
  const userId = req.session.userId;

  if (!req.session.theme) {
    req.session.theme = "dark"; // Set default theme to 'light' if not already set
  }
  const usersNotificationDetails = await usersNotification.find({
    postId: userId,
  });
  try {
    res.render("user/home", {
      username: username,
      usersNotificationDetails: usersNotificationDetails,
      session: req.session,
    }); // Render the home template with the username retrieved from the session
  } catch (error) {
    console.error("Error fetching users' notification details:", error);
    // Handle the error appropriately, e.g., sending an error response or rendering an error page
    res.status(500).send("Internal Server Error");
  }
});

router.get("/signup", async (req, res) => {
  const userId = req.session.userId;

  const usersNotificationDetails = await usersNotification.find({
    postId: userId,
  });
  if (req.session.theme === "light") {
    res.render("user/signup", {
      session: req.session,
      usersNotificationDetails: usersNotificationDetails,
    });
  } else {
    res.render("user/signup_dark", {
      session: req.session,
      usersNotificationDetails: usersNotificationDetails,
    });
  }
});

router.get("/signin", async (req, res) => {
  const userId = req.session.userId;

  const usersNotificationDetails = await usersNotification.find({
    postId: userId,
  });
  const passwordError = req.query.data === "passwordError"; // Check if the query parameter 'data' is 'passwordError'
  const emailError = req.query.data === "emailNotFound"; // Check if the query parameter 'data' is 'emailNotFound'

  if (req.session.theme === "light") {
    res.render("user/signin", {
      errorMessage: { passwordError, emailError },
      session: req.session,
      usersNotificationDetails: usersNotificationDetails,
    }); // Render the signin template initially
  } else {
    res.render("user/signin_dark", {
      errorMessage: { passwordError, emailError },
      session: req.session,
      usersNotificationDetails: usersNotificationDetails,
    }); // Render the signin template initially
  }
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
      // res.redirect("/signin");
      res.send(`
      <script>
        window.open('http://localhost:3000/admin', '_blank');
        window.location.replace('/signin');
      </script>
      `);
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
            req.session.userId = userEmail._id;
            req.session.useremail = userEmail.email;
            req.session.username = userEmail.name;
            req.session.userphone = userEmail.phone;
            req.session.userplace = userEmail.place;

            console.log("Data stored in session", req.session);
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

router.get("/aboutme", async (req, res) => {
  const userId = req.session.userId;

  const usersNotificationDetails = await usersNotification.find({
    postId: userId,
  });
  res.render("user/about", {
    session: req.session,
    usersNotificationDetails: usersNotificationDetails,
  });
});

router.get("/FAQ", async (req, res) => {
  const userId = req.session.userId;

  const usersNotificationDetails = await usersNotification.find({
    postId: userId,
  });
  res.render("user/FAQ", {
    session: req.session,
    usersNotificationDetails: usersNotificationDetails,
  });
});

// Server-side route to handle theme switching
router.post("/set-theme", (req, res) => {
  // Assuming the theme toggle data is sent in the request body under the key 'toggle'
  const themeToggle = req.body.currentTheme;

  // Toggle between 'light' and 'dark' themes based on the current session theme
  if (themeToggle) {
    req.session.theme = req.session.theme === "dark" ? "light" : "dark";
  } else {
    req.session.theme = req.session.theme === "light" ? "dark" : "light";
  }

  res.sendStatus(200); // Respond with success status
});

module.exports = router;
