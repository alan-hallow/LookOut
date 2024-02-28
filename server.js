const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const session = require("express-session");

const app = express();

// Debugging: Log when each middleware is being initialized
app.use(
  session({
    secret: "your-secret-key", // Change this to a secret key of your choice
    resave: false,
    saveUninitialized: false,
  })
);

app.use(fileUpload());

//static files
app.use(express.static("public"));

app.use(
  express.urlencoded({
    extended: true,
  })
);

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
