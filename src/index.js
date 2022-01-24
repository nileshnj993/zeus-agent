const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const app = express();
const saltRounds = 5;


mongoose.connect("mongodb://localhost/zeusagent", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", (err) => console.log(err));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userSchema = mongoose.Schema({
  name: String,
  password: String,
  email: String,
  designation: String
});
const User = new mongoose.model("users", userSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "register.html"));
});


app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "home.html"));
  });

app.post("/create", (req, res) => {
  let plainPassword = req.body.password;
  bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
    if (err) throw err;
    signupDetails = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      designation: req.body.designation,
    };
    User.create(signupDetails, (err, response) => {
      if (err) {
        res.status(500).send();
      } else {
        res.sendFile(path.join(__dirname, "../public", "registered.html"));
      }
    });
  });
});

app.post("/home", (req, res) => {
  loginDetails = {
    email: req.body.email,
    password: req.body.password,
  };
  User.find({ email: loginDetails.email }, (err, response) => {
    if (err) throw err;
    else {
      if (Object.entries(response).length === 0) {
        res.sendFile(path.join(__dirname, "../public", "userNotFound.html"));
      } else {
        bcrypt.compare(loginDetails.password, response[0].password, (error, resp) => {
          if (error) throw error;
          if (resp === true) {
            res.sendFile(path.join(__dirname, "../public", "home.html"));
          } else {
            res.sendFile(path.join(__dirname, "../public", "wrongPassword.html"));
          }
        });
      }
    }
  });
});



app.use(express.static(path.join(__dirname, "../public")));
const PORT = process.env.PORT || 8080;


app.get("/test", (req,res)=>{
    res.send("testing");
})

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
