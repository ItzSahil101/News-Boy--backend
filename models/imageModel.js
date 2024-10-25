const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    name: String,
    contentType: String,
    imageBase64: String,
})

module.exports = mongoose.model("images", imageSchema)