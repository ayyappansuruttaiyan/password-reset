const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(bodyParser.json());

//mongodb connection
mongoose
  .connect("mongodb://localhost:27017/password-reset")
  .then((response, error) => {
    if (response) {
      console.log("db connected successfully");
    } else {
      res.status(500).send().json({
        type: false,
        message: "something went wrong",
      });
      console.log("internal error");
      console.error(error);
    }
  })
  .catch((error) => {
    console.log(error);
  });
//server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

// User schema
const userSchema = mongoose.Schema({
  email: String,
  randomString: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Node Mailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: "ayyappan.sjec@gmail.com",
    pass: "",
  },
});

// routes
app.post("/api/forgot-password", (req, res) => {
  const { email } = req.body;

  // check if the user exists in the db
  const user = User.findOne({ email });
  if (!user) {
    return res.status(400).send("User Not Found");
  }
});
