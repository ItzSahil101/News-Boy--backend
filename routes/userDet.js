const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

router.post('/', (req,res)=>{
    const { token } = req.body;  // Get the token from the request
    const SECRET_KEY =  process.env.JWT_KEY;

  if (token) {
    // Decode the token using your secret key
    jwt.verify(token, SECRET_KEY, async(err, decoded) => {
      if (err) {
        return res.status(400).json({ msg: 'Invalid token' });
      }

      // If token is valid, send the decoded data back to the frontend
       const userDetails = await userModel.findOne({email: decoded.email});
      res.json({details: userDetails });
    });
  } else {
    res.status(400).json({ msg: 'No token provided' });
  }
})

module.exports = router;