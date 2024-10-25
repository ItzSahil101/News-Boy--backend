const express = require("express");
const router = express.Router();
const userModel = require('../models/userModel');

router.delete('/user/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await userModel.findByIdAndDelete(id);
      if (deletedUser) {
        return res.status(200).json({ message: 'User deleted successfully' });
      }
      return res.status(404).json({ message: 'User not found' });
    } catch (err) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

module.exports = router;