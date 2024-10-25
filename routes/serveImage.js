const express = require('express');
const router = express.Router();
const imageModel = require('../models/imageModel'); // Ensure image model path is correct

router.get('/image/:id', async (req, res) => {
  try {
    const imageId = req.params.id;
    const imageData = await imageModel.findById(imageId);

    if (!imageData) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({
      imageBase64: imageData.imageBase64,
      contentType: imageData.contentType
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
