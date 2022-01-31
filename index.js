const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const bodyparser = require("body-parser");
const date = require("date-and-time");
const config = require('dotenv').config();
const app = express();

app.set("view engine", "ejs");
app.use(bodyparser.json());
app.use(express.static("public"));
const saltRounds = 5;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage,  limits: { fileSize: 2000000 } }).single("image");

mongoose.connect("mongodb+srv://team12:"+process.env.DB_PASSWORD+"@zeus-agent.xbtgg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", (err) => console.log(err));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userSchema = mongoose.Schema({
  name: String,
  password: String,
  email: String,
  designation: String,
});
const User = new mongoose.model("users", userSchema);
const userNotes = mongoose.Schema({
  email: String,
  desc: [
    {
      title: String,
      text: String,
      date: String,
      expire: String,
      img: String,
    },
  ],
});
const stickyNote = new mongoose.model("stickyNotes", userNotes);
const publicSchema = mongoose.Schema({
  title: String,
  text: String,
  date: String,
  expire: String,
  img: String,
});
const Public = new mongoose.model("public", publicSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/logout", (req, res) => {
  res.clearCookie("userEmail");
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.post("/createAcc", (req, res) => {
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
        res.sendFile(path.join(__dirname, "public", "registered.html"));
      }
    });
    userNote = {
      email: req.body.email,
      desc: [],
    };
    stickyNote.create(userNote, (err, response) => {
      if (err) {
        res.status(500).send();
        throw err;
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
        res.sendFile(path.join(__dirname, "public", "userNotFound.html"));
      } else {
        bcrypt.compare(loginDetails.password, response[0].password, (error, resp) => {
          if (error) throw error;
          if (resp === true) {
            res.cookie("userEmail", loginDetails.email);
            res.sendFile(path.join(__dirname, "public", "home.html"));
          } else {
            res.sendFile(path.join(__dirname, "public", "wrongPassword.html"));
          }
        });
      }
    }
  });
});

app.post("/createNote", (req, res) => {
  let imagePath;
  let note;
  upload(req, res, (err) => {
    if (err) {
        res.send('File too big!');
    }
    else {
      if (req.file == undefined) imagePath = "";
      else imagePath = "images/" + req.file.filename;

      const temp = new Date();
      var ISToffSet = 330; 
      var offset= ISToffSet*60*1000;
      var time = new Date(temp.getTime()+offset);

      const expiretime = date.addSeconds(time, req.body.expirationTime);
      note = {
        title: req.body.stickyNoteTitle,
        text: req.body.stickyNoteText,
        date: time,
        expire: expiretime, 
        img: imagePath,
      };
      Public.create(note, (err, response) => {
        if (err) res.status(500).send();
        var id = response._id.toString();
        stickyNote.updateOne({ email: req.cookies.userEmail }, { $push: { desc: note } }, (err, response) => {
          if (err) throw err;
          else {
            res.render("getURL", {data: id});
          }
        });
      });
    }
  });
});

app.get("/prevNotes", (req, res) => {
  stickyNote.find({ email: req.cookies.userEmail }, (err, response) => {
    if (err) throw err;
    else {
      var time = new Date();
      var data = response[0];
      var dataSend = {
        email: data.email,
        desc: []
      }
      var j = 0;
      for(var i=0; i< data.desc.length; i++){
        if(time < new Date(data.desc[i].expire))
          dataSend.desc[j++] = data.desc[i];
      }
      res.render("previousNotes", { data: dataSend });
    }
  });
});


app.post("/viewFullNote", (req, res) => {
  stickyNote.find({ email: req.cookies.userEmail }, (err, response) => {
    if (err) throw err;
    else {
      const temp = new Date();
      var ISToffSet = 330; 
      var offset= ISToffSet*60*1000;
      var time = new Date(temp.getTime()+offset);
      var data = response[0];
      var dataSend = {
        email: data.email,
        desc: []
      }
      var j = 0;
      for(var i=0; i< data.desc.length; i++){
        if(time < new Date(data.desc[i].expire))
          dataSend.desc[j++] = data.desc[i];
      }
      let individualNote = dataSend.desc[req.body.btnid];
      res.render("noteContent", {data: individualNote});
    }
  });
});

app.get("/:id", (req,res) => {
  Public.find({ _id: req.params.id}, (err, response) =>{
    if(err) res.status(404).json("Incorrect URL");
    else {
      var data = response[0];
      if(new Date() > new Date(data.expire))
        res.status(404).json("Note Has Expired");
      res.render("publicNote", {data: data});
    }
  });
});


app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
