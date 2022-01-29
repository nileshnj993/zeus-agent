const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const bodyparser = require("body-parser");
const date = require("date-and-time");
const app = express();
const config = require('dotenv').config();

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


mongoose.connect("mongodb+srv://team12:"+process.env.DB_PASSWORD+"@zeus-agent.xbtgg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
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
      expire: String,
      url:String,
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

app.post("/createAcc", async (req, res) => {
  const user = await User.findOne({email:req.body.email});
  if(user){
      res.send('<html><head><title>Zeus Agent</title> <meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel = "stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"><link rel = "stylesheet" href="css/styles.css"><link rel="icon" href="images/plane.png"></head><body><div class="card-body p-5 text-center" id="login"><img src="images/logo.png" width="10%" height="20%"></div><p style="font-weight: bolder;font-size: 300%;color:red;text-align: center; margin-top: -70px;">Zeus Agent</p><p style="font-weight: bolder;font-size: 200%;color:black;text-align: center; margin-top: 120px;">Email ID already Taken!</p><div id="successmsg" style="display: flex;justify-content: center;align-items: center;"><p style="font-size: 150%;color:black;"></p><a href="/register"><input type="button" class="btn btn-outline-light btn-lg px-5" value="Create My Account" style="width:fit-content;font-weight: bolder; margin-top: 120px;"> </a></div></body></html>')
  }
  else{
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
}
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
    
    console.log("Response:", res);
    upload(req, res, (err) => {
        console.log("Request:",req);
      if (err) throw err;
      else {
          console.log(res);
        if (req.file == undefined) imagePath = "";
        else imagePath = "images/" + req.file.filename;
        const time = new Date();
        const expiretime = date.addSeconds(time, req.body.expirationTime);
        note = {
          title: req.body.stickyNoteTitle,
          text: req.body.stickyNoteText,
          date: time,
          img: imagePath,
          expire: expiretime,
        };
      
        Public.create(note, (err, response) => {
            if (err) res.status(500).send();
            var id = response._id.toString();
            note.url = process.env.ROUTE+id;
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
   
      }
    });
  });
  
  
  app.post("/viewFullNote", (req, res) => {
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
        let individualNote = dataSend.desc[req.body.btnid];
        res.render("noteContent", {data: individualNote});
      }
    });
  });
  
app.get("/:id", (req,res) => {
    Public.find({ _id: req.params.id}, (err, response) =>{
    if(err)  res.status(404).send("<h1 style='text-align:center;margin-top:400px;align-items:center;'>Incorrect URL<h1>");
    else {
      var data = response[0];
      if(new Date() > new Date(data.expire))
        res.status(404).send("<h1 style='text-align:center;margin-top:400px;align-items:center;'>Note Has Expired<h1>");
      res.render("publicNote", {data: data});
    }
  });
});



app.use(express.static(path.join(__dirname, "../public")));
const PORT = process.env.PORT || 8080;


app.get("/test", (req,res)=>{
    res.send("testing");
})

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
