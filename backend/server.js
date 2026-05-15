const fs = require("fs");
const skillsList = require("./skills");
const multer = require("multer");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();

// MULTER STORAGE

const storage = multer.diskStorage({

  destination: function(req, file, cb) {

    cb(null, "uploads");

  },

  filename: function(req, file, cb) {

    cb(null, Date.now() + "-" + file.originalname);

  }

});

const upload = multer({
  storage: storage
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

const userSchema = new mongoose.Schema({

  email: String,
  password: String

});

const User = mongoose.model("User", userSchema);



app.get("/", (req, res) => {
  res.send("Backend Running");
});


// REGISTER
app.post("/register", async (req, res) => {

  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if(existingUser) {
    return res.json({
      message: "User already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPassword
  });

  await newUser.save();

  res.json({
    message: "Registration Successful"
  });

});


// LOGIN
app.post("/login", async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if(!user) {
    return res.json({
      message: "User not found"
    });
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if(!isMatch) {
    return res.json({
      message: "Invalid Password"
    });
  }

  const token = jwt.sign(
    { id: user._id },
    "secretkey"
  );

  res.json({
    message: "Login Successful",
    token
  });

});

// INTERNSHIP API

app.get("/internships", (req, res) => {

  const internships = [

    {
      company: "Google",
      role: "Frontend Developer Intern",
      location: "Bangalore",
      skills: ["html", "css", "javascript", "react"]
    },

    {
      company: "Microsoft",
      role: "Backend Developer Intern",
      location: "Hyderabad",
      skills: ["node", "express", "mongodb"]
    },

    {
      company: "Amazon",
      role: "Full Stack Intern",
      location: "Chennai",
      skills: [
        "react",
        "node",
        "mongodb",
        "javascript"
      ]
    },

    {
      company: "Infosys",
      role: "AI/ML Intern",
      location: "Pune",
      skills: ["python"]
    }


  ];

  res.json(internships);

});


// APPLICATION SCHEMA

const applicationSchema = new mongoose.Schema({

  studentEmail: String,
  company: String,
  role: String

});

const Application = mongoose.model(
  "Application",
  applicationSchema
);


// APPLY INTERNSHIP API

app.post("/apply", async (req, res) => {

  const {
    studentEmail,
    company,
    role
  } = req.body;

  const newApplication = new Application({

    studentEmail,
    company,
    role

  });

  await newApplication.save();

  res.json({
    message: "Application Submitted Successfully"
  });

});

// RESUME UPLOAD API

app.post(
  "/upload-resume",
  upload.single("resume"),
  async (req, res) => {

    try {

      const resumeText = fs.readFileSync(
        req.file.path,
        "utf-8"
      ).toLowerCase();

      const matchedSkills = skillsList.filter(
        (skill) =>
          resumeText.includes(skill)
      );

      res.json({

        message: "Resume Processed Successfully",

        skills: matchedSkills

      });

    } 
    
    catch(error) {

      console.log("PDF ERROR:");
      console.log(error);

      res.json({
        message: error.message
      });

    }

  }
);
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});