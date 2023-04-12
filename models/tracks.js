const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: Array,
        required: true,
        default: 'Unknown'
    },
    thumbnail: {
        type: String,
        required: true,
        default: 'http://fakethumbnail.jpg'
    },
    release_year: {
        type: Number,
        required: true,
        default: 2023
    },
    duration: {
        type: String,
        required: true,
        default: '3:00'
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: Array,
        required: true,
        default: 'new'
    },
    uri: {
        type: String,
        required: true,
        default: 'http://fakeurl.com'
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Track', userSchema)