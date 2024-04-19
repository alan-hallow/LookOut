const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const session = require("express-session");
// const nocache = require("nocache");

const app = express();

// Debugging: Log when each middleware is being initialized
app.use(
  session({
    secret: "your-secret-key", // Change this to a secret key of your choice
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json()); // Middleware to parse JSON requests
// //  noCache Begins

// app.set("etag", false);

// app.use((req, res, next) => {
//   res.set("Cache-Control", "no-store");
//   next();
// });

// app.disable("view cache");

// app.use(function (req, res, next) {
//   if (!req.user) {
//     res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
//     res.header("Expires", "-1");
//     res.header("Pragma", "no-cache");
//   }
//   next();
// });

// // noCache ends

app.use(fileUpload());

//static files
app.use(express.static("public"));

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Middleware function to set Cache-Control header
function setNoCache(req, res, next) {
  res.setHeader("Cache-Control", "no-store");
  next();
}

// Set view engine as EJS
app.set("view engine", "ejs");
app.set("views", "views/");

//mongodb connection
mongoose.connect("mongodb://localhost:27017/LookOut");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB successfully");
});

// Debugging: Log when each router is being initialized
const userHomeRouter = require("./routes/user/home");

const childRouter = require("./routes/user/user-kids");

const elderlyRouter = require("./routes/user/router-elderly");

const petsRouter = require("./routes/user/router-pets");

const vehicleRouter = require("./routes/user/router-vehicle");

const valuableRouter = require("./routes/user/router-valuable");

const corpsesRouter = require("./routes/user/router-corpses");

const adminRouter = require("./routes/admin/admin-home");

try {
  app.use("/", userHomeRouter);
  app.use("/missingkids", childRouter);
  app.use("/missingelderly", elderlyRouter);
  app.use("/missingpets", petsRouter);
  app.use("/missingvehicle", vehicleRouter);
  app.use("/missingvaluable", valuableRouter);
  app.use("/corpses", corpsesRouter);
  app.use("/admin", adminRouter);
} catch (error) {
  console.error("Error occurred during router setup:", error);
}

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
