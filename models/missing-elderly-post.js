const mongoose = require('mongoose')

const missingElderlySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    placeofliving: {
        type: String,
        required: true
    },
    placewentmissing: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    dress: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    reward: {
        type: Number,
        required: true
    },
    missingdate: {
        type: Date,
        required: true
    },
    createddate: {
        type: Date,
        required: true,
        default: Date.now
    }
})



module.exports = mongoose.model('missingelderly', missingElderlySchema)