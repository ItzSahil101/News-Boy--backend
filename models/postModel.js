const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    imgUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: [
        {type: String, ref: "user"}
    ],
    date: {
        type: Date,
        default: Date.now
    },
    likes: [
        {type: mongoose.Schema.Types.ObjectId, ref: "user"}
    ]
})

module.exports = mongoose.model("userPost", postSchema)