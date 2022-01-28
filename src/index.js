const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const bodyparser = require("body-parser");
const app = express();
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "../views"));
app.use(bodyparser.json());
const saltRounds = 5;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../public","../public/images"));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage: storage }).single("image");


mongoose.connect("mongodb://localhost/zeusagent", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", (err) => console.log(err));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true     }));


const userSchema = mongoose.Schema({
  name: String,
  password: String,
  email: String,
  designation: String
});
const User = new mongoose.model("users", userSchema);

const userNotes = mongoose.Schema({
  email: String,
  desc: [
    {
      title: String,
      text: String,
      date: String,
      img: String,
    },
  ],
});
const stickyNote = new mongoose.model("stickyNotes", userNotes);



app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "register.html"));
});


app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "home.html"));
  });

app.get("/logout", (req, res) => {
    // cookies.set('userEmail', {expires: new Date(0)});
    res.cookie("userEmail","", {expires:new Date(0)});
    //res.clearCookie("userEmail");
    res.sendFile(path.join(__dirname, "../public", "index.html"));
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
        res.sendFile(path.join(__dirname, "../public", "registered.html"));
      }
    });
    var userNote = {
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
        res.sendFile(path.join(__dirname, "../public", "userNotFound.html"));
      } else {
        bcrypt.compare(loginDetails.password, response[0].password, (error, resp) => {
          if (error) throw error;
          if (resp === true) {
            res.cookie("userEmail", loginDetails.email);
            res.sendFile(path.join(__dirname, "../public", "home.html"));
          } else {
            res.sendFile(path.join(__dirname, "../public", "wrongPassword.html"));
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
      if (err) throw err;
      else {
        if (req.file == undefined) imagePath = "";
        else imagePath = "images/" + req.file.filename;
        note = {
          title: req.body.stickyNoteTitle,
          text: req.body.stickyNoteText,
          date: new Date(),
          img: imagePath,
        };
        stickyNote.updateOne({ email: req.cookies.userEmail }, { $push: { desc: note } }, (err, response) => {
          if (err) throw err;
          else {
            res.sendFile(path.join(__dirname, "../public", "getURL.html"));
          }
        });
      }
    });
  });
  
  app.get("/prevNotes", (req, res) => {
      console.log(req.cookies);
      if(req.cookies.userEmail==""){
        res.render("previousNotes", { data: "session-over"});
      }
    stickyNote.find({ email: req.cookies.userEmail }, (err, response) => {
      if (err) throw err;
      else {
          console.log("Response:",response);
          if(response.length==0){
            console.log('empty');
            res.send("<h3 style='font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;'> Session expired! Please login again. </h3>");
          }
          else{
            var data = response[0];
            res.render("previousNotes", { data: data });
          }
   
      }
    });
  });
  
  
  app.post("/viewFullNote", (req, res) => {
    stickyNote.find({ email: req.cookies.userEmail }, (err, response) => {
      if (err) throw err;
      else {
        let individualNote = response[0].desc[req.body.btnid];
        res.render("noteContent", {data: individualNote});
      }
    });
  });
  



app.use(express.static(path.join(__dirname, "../public")));
const PORT = process.env.PORT || 8080;


app.get("/test", (req,res)=>{
    res.send("testing");
})

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
