const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require('jsonwebtoken');
const path = require('path');
const postModel = require("../models/postModel");
const userModel = require('../models/userModel');
const imageModel = require("../models/imageModel");

// Use memory storage for Multer
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single('file'), async (req, res) => {
  try {
    // Check if the file was properly uploaded
    if (!req.file) {
      return res.status(400).json({ msg: "File upload failed" });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
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

      // Create the image in the imageModel
      const newImage = await imageModel.create({
        name: req.file.originalname,
        contentType: req.file.mimetype,
        imageBase64: req.file.buffer.toString('base64') // Convert buffer to base64 string
      });

      // Create the post and save the image reference
      const post = await postModel.create({
        imgUrl: newImage._id, // Store the image document ID in post model
        title: req.body.title,
        description: req.body.description,
        author: userDetails.email
      });

      userDetails.posts.push(post._id);
      await userDetails.save();

      res.status(200).json({ msg: "Successfully uploaded!" });
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
