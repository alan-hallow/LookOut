const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createddate: {
        type: Date,
        default: Date.now
    }
})



module.exports = mongoose.model('users', usersSchema)