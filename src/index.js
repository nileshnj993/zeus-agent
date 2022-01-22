const express = require("express");
const config = require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/test", (req,res)=>{
    res.send("testing");
})

app.listen(PORT,()=>{
    console.log("Running on port "+PORT);
})