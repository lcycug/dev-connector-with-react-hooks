const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const app = express();

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// config DB
const db = require("./config/keys").mongoURI;
// connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

// Routes
const posts = require("./routes/api/posts");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");

app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/profile", profile);

// Static assets setting for prod
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Passport middleware
app.use(passport.initialize());
require("./config/passport")(passport);

// Port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
