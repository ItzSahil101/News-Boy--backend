const express = require("express");
const router = express.Router();
const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');

  router.post('/yourposts', (req, res)=>{
    let token = req.body.token;
    const SECRET_KEY =  process.env.JWT_KEY;

    if (token) {
        // Decode the token using your secret key
        jwt.verify(token, SECRET_KEY, async(err, decoded) => {
          if (err) {
            return res.status(400).json({ msg: 'Invalid token' });
          }
    
          // If token is valid, send the decoded data back to the frontend
           const userEmail = decoded.email;

           const posts = await postModel.find({ author: userEmail });
           res.status(200).json({posts})
        });
      } else {
        res.status(400).json({ msg: 'No token provided' });
      }

  })

  router.post("/postDel", async (req, res) => {
    try {
      const s_postsId = req.body.postId;
  
      // Find the post to delete
      const selectPost = await postModel.findOne({ _id: s_postsId });
      if (!selectPost) {
        return res.status(400).json({ msg: "No post exists" });
      }
  
      // Delete the post from postModel
      await postModel.deleteOne({ _id: s_postsId });
  
      // Remove the post ID from the user's posts array in userModel
      await userModel.updateOne(
        { posts: s_postsId },              // Locate the user by post ID
        { $pull: { posts: s_postsId } }     // Pull the post ID from the user's posts array
      );
  
      res.json({ msg: "Post successfully deleted"});
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "Something went wrong" });
    }
  });
  

module.exports = router;