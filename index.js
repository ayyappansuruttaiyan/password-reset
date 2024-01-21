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
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;

  // check if the user exists in the db
  const user = User.findOne({ email });
  if (!user) {
    return res.status(400).send("User Not Found");
  }

  // if user found , generate random string
  const randomString = Math.random().toString(36).substring(7);

  // store the random string in the db with the respective user
  user.randomString = randomString;
  await user.save();

  // send mail with the random string for the particular user
  const mailOptions = {
    from: "mymail@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: http://localhost:3000/api/reset-password/${randomString}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Error sending mail");
    }
    res.status(200).send("Email sent. check your inbox");
  });
});

app.get("api/reset-password/:randomString", async (req, res) => {
  const { randomString } = req.body;

  // check if the random string exists in the databse
  const user = await User.findOne({ randomString });

  if (!user) {
    return res.status(404).send("Invalid Link");
  }

  // if the randomstring matches, display the password reset form
  res.send(`
  <form action="/reset-password/${randomString}" method="post">
    <label for="newPassword">New Password:</label>
    <input type="password" id="newPassword" name="newPassword" required>
    <button type="submit">Reset Password</button>
  </form>
`);
});