const express = require("express");
const router = express.Router();
const userModel = require('../models/userModel.js');
const multer = require('multer');
const path = require('path');
const { generateToken } = require("../utils/generateToken");

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

// Update route with Multer
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { userName, pass, id } = req.body;
    const image = req.file.filename;
    // console.log(image)

    await userModel.updateOne(
      { _id: id },
      {
        $set: {
          userName: userName,
          pass: pass,
          profileUrl: image,  // Save image URL to the profileUrl field
        },
      }
    );


    // let uUser = await userModel.findOne({_id: id})
    // let token = generateToken(uUser);
    // console.log(uUser, token)
    return res.status(200).json({ msg: "Updated" });
  } catch (err) {
    res.status(400).json({ err: err });
  }
});

module.exports = router;
