const express = require("express");
const userDataHelper = require("./../../helpers/user/helper-signup");
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
      res.render("admin/home");
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

module.exports = router;
