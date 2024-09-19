const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    from: {
        type: String,
        required: true
    },
     data: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("report", reportSchema)