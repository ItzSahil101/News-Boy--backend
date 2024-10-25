const express = require("express");
const router = express.Router();
const userModel = require('../models/userModel.js');
const imageModel = require("../models/imageModel.js"); // Ensure this is properly imported
const multer = require('multer');
const { generateToken } = require("../utils/generateToken");

// Use memory storage with multer
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { userName, pass, id } = req.body;

    // Check if the image was uploaded
    if (!req.file) {
      return res.status(400).json({ msg: "File upload failed" });
    }

    // Save image to imageModel in base64 format
    const newImage = await imageModel.create({
      name: req.file.originalname,
      contentType: req.file.mimetype,
      imageBase64: req.file.buffer.toString('base64')
    });

    // Update user profile with new image ID and other details
    await userModel.updateOne(
      { _id: id },
      {
        $set: {
          userName: userName,
          pass: pass,
          profileUrl: newImage._id // Store the image document ID as reference
        }
      }
    );

    // Generate a new token if necessary (uncomment if needed)
    // let uUser = await userModel.findOne({ _id: id });
    // let token = generateToken(uUser);

    return res.status(200).json({ msg: "Updated", imageId: newImage._id });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(400).json({ err: err.message });
  }
});

module.exports = router;
