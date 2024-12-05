const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

router.post("/signup", async (req, res) => {
  const { fullName, email, password, phone, dob } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
      dob,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error signing up", error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});


const tranporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: process.env.pass,
  },
});

router.post("/forget", async (req, res) => {
  
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if(user){
      console.log("Database lookup result:", user);
    }

    if (!user) {
      return res.status(404).json({
        message: "email dosent exist",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    console.log("Generated Token:", token);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `${req.protocol}://${req.get("host")}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.email,
      to: user.email,
      subject: "password reset request",
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
      html: `<p>You requested a password reset. Click the link to reset your password: ${resetUrl}</p>
            <a href = "${resetUrl}">${resetUrl}</a>`,
    };
 
    await tranporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    res.status(200).json({
      message: "Password reset link sent to your email.",
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({
      message: "An error occurred. Please try again later.",
    });
  }
});

router.post('/reset-password', async(req,res) => {
  console.log("reset password hit")
  const { token , password } = req.body

  try{
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {$gt: Date.now()}
    })

    if(!user){
      return res.status(400).json({message : "Invalid or expired token"})
    }

    const hashedPassword = await bcrypt.hash(password , 10)

    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.status(200).json({message : 'Password has been reset successfully.' })
  }
  catch(error){
    console.log(error)
    res.status(500).json({message : "An error occurred. Please try again later."})
  }

})

module.exports = router;
