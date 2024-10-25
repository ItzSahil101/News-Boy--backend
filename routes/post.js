const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require('jsonwebtoken');
const path = require('path');  // make sure you import 'path'
const postModel = require("../models/postModel");
const userModel = require('../models/userModel');

// Fix multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Correct callback 'cb'
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post("/", upload.single('file'), async (req, res) => {
  try {
    // Check if file is properly uploaded
    if (!req.file) {
      return res.status(400).json({ msg: "File upload failed" });
    }

    const authHeader = req.headers.authorization; // Extract token from headers
    const token = authHeader && authHeader.split(" ")[1]; // Get the token part
    const SECRET_KEY = process.env.JWT_KEY;

    if (!token) {
      return res.status(400).json({ msg: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ msg: 'Invalid token' });
      }

      const userDetails = await userModel.findOne({ email: decoded.email });

      // Check if a post with the same title and description already exists
      let postExists = await postModel.findOne({ title: req.body.title, description: req.body.description });
      if (postExists) {
        return res.status(400).json({ msg: "Post already exists with that title and description" });
      }

      const post = await postModel.create({
        imgUrl: req.file.filename, // Use filename, not fieldname
        title: req.body.title,
        description: req.body.description,
        author: userDetails.email
      });

      userDetails.posts.push(post._id);
      await userDetails.save();

      res.status(200).json({ msg: "Successfully uploaded!" });
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
