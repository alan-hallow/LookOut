const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const session = require("express-session");

const app = express();

// Set up session middleware
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

//routes
const userHomeRouter = require("./routes/user/home");
const childRouter = require("./routes/user/user-kids");
const elderlyRouter = require("./routes/user/router-elderly");
const petsRouter = require("./routes/user/router-pets");

app.use("/", userHomeRouter);
app.use("/missingkids", childRouter);
app.use("/missingelderly", elderlyRouter);
app.use("/missingpets", petsRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
